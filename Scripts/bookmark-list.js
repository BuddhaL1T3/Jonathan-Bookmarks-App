'use strict'
/* global store, Item, bookmarkList, api */

const bookmarkList = (function(){
///////////////////////////////////////////////////////////////////////////////////////
    function render(){
        console.log("--------------------------------------------Render Ran");
        if (store.error) {
            alert(store.error)
        } 
                
        let items = store.items   

        if(store.errors) {
            //call function to diplay error from api
        }
    
        if(store.addItemForm) {
            const displayAddBookmarkForm = generateAddBookmarkString()
            $('.top-menu').html(displayAddBookmarkForm);
        }
        
        if(!store.addItemForm) {
            const displayTopMenu = generateTopMenuHtml()
            $('.top-menu').html(displayTopMenu);
        }

        if(store.filterRating > 0) {
            items = store.items.filter(item => item.rating >= store.filterRating);
        }

        if(store.searchTerm) {
            items = store.items.filter(item => item.title.includes(store.searchTerm));
        }
        if(store.searchTerm = '') {
            items = store.items;
        }
        
        const bookmarkListItemsString = generateBookmarkString(items);
        $('.bookmark-list').html(bookmarkListItemsString);
    }
///////////////////////////////////////////////////////////////////////////////////////

    function generateBookmarkString(bookmarkList){ 
        const items = bookmarkList.map((item) => generateItemElement(item));  
        return items.join('');
    }

    function generateItemElement(item){
        if(!item.expanded) {
        return `
                <li class="item-element" data-item-id="${item.id}">
                    <button class="title">${item.title}</button>
                    <p>Rating = ${item.rating}</p>
                </li> 
            `
        }
        if (item.expanded){
            return `
                <li class="item-element" data-item-id="${item.id}">
                    <button class="title" type="button">${item.title}</button>
                    <p>Rating = ${item.rating}</p>
                    <label>Description</label>
                    <p>${item.description}</p>
                    <a href="${item.website} class="website-link">Visit Site</a>
                    <button class="delete-bookmark" type="button">Delete</button>
                </li>    
            `
        }        
    }


    function generateAddBookmarkString(){
        return `
        <div class="create-bookmark">
            <form id="create-bookmark-form" class="create-bookmark-form">
                <h3>Create a Bookmark</h3>
                <label for="bookmark-title">Title</label>
                <input type="text" name="title" class="bookmark-title" required placeholder="Title">
                
                <label for="website">Website</label>
                <input type="text" name="url" class="website" required placeholder="https://www.bookedsite.com/">
                
                <label for="description">Description</label>
                <input type="text" name="desc" class="description" placeholder="Add Description">
                
                <label for="rating-entry">Select a Rating</label>  
                <input type="number" min="1" max="5" name="rating" class="rating" placeholder="1-5">
                
                <div>
                    <button class="confirm-button" type="submit">Confirm</button>
                    <button class="cancel-button" type="button">Cancel</button>
                </div>
            </form>
        </div>
        `
    }

    function generateTopMenuHtml() {
        return `
            <button class="add-button">Add Bookmark</button>
            <div class="dropdown">
                <label for="rating-dropdown">Filter Minimum Rating</label>  
                <select class="dropdown-content">
                    <option value="0">All</option>
                    <option value="1" ${store.filterRating == 1 ? "selected":""}>Rating: 1</option>
                    <option value="2" ${store.filterRating == 2 ? "selected":""}>Rating: 2</option>
                    <option value="3" ${store.filterRating == 3 ? "selected":""}>Rating: 3</option>
                    <option value="4" ${store.filterRating == 4 ? "selected":""}>Rating: 4</option>
                    <option value="5" ${store.filterRating == 5 ? "selected":""}>Rating: 5</option>
                </select>
            </div>         
            <form>
                <label for="search-entry">Search:</label>
                <input type="text" name="search-entry" class="search-entry" />
            </form>
        `
    }

    function handleNewItemForm() {
        $('.top-menu').on('click', '.add-button', function(event) {
            event.preventDefault();
            store.toggleAddItemForm();
            render()
        });
    }
    function handleConfirmAdd(){
        $('.top-menu').on('submit', '.create-bookmark-form', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = {};
            formData.forEach(function(value, key) {
                data[key] = value;    
            });
            api.createItem(data, function(bookmark){
                store.addItem(bookmark);
                store.toggleAddItemForm();
                render()
            },
            function (error) {
                store.setError(JSON.parse(error.responseText));
                console.log(store.error)
                render();
            }); 
        });
    }

    function handleCancelAdd(){
        $('.top-menu').on('click', '.cancel-button', function(event) {
            event.preventDefault();
            store.toggleAddItemForm();
            render()
        });
    }

    function getItemIdFromElement(item) {
        return $(item).closest('.item-element').data('item-id');
    }

    function handleTitleClick(){
        $('.bookmark-list').on('click', '.title', function(event) {
            event.preventDefault();
            const id = getItemIdFromElement(event.currentTarget);
            store.toggleExpanded(id);
            render();
        });
    }

    function handleDeleteItem() {
        $('.bookmark-list').on('click', '.delete-bookmark', function(event) {
            event.preventDefault();
            const id = getItemIdFromElement(event.currentTarget);
            api.findAndDelete(id, function(bookmark){
                store.findAndDelete(id);
                render()
            });
        });
    }

    function handleFilterByRating(){
        $('.top-menu').on('change', '.dropdown-content', function(event) {
            const val = $(event.currentTarget).val();
            store.setFilterRating(val);
            render();
          });
    }

    function handleSearch(){
        $('.top-menu').on('keyup', '.search-entry', function(event) {
            event.preventDefault();
            const val = $(event.currentTarget).val();
            store.setSearchTerm(val);
            render();
          });
    }

    function bindEventListeners(){
        handleNewItemForm();
        handleConfirmAdd();
        handleCancelAdd();
        handleTitleClick();
        handleDeleteItem();
        handleSearch();
        handleFilterByRating();
    }
    return {
        render,
        bindEventListeners,
    }

}());