'use strict'
/* global store, Item, bookmarkList, api */


const store = (function() {
    const items = [];    
    const searchTerm = null;
    const filterRating = 0;
    const addItemForm = false;
    const error = null;

    function findAndDelete(id) {
        this.items = this.items.filter(item => {
            return item.id !== id;
        });
    }

    const setError = function(error) {
        this.error = error;
      };

    function setFilterRating(val) {
        this.filterRating = val;
    }

    function toggleAddItemForm() {
        this.addItemForm = !this.addItemForm;
    }

    function setSearchTerm(val) {
        this.searchTerm = val;
    }

    function toggleExpanded(id) {
        const currentItem = this.items.find(item => item.id === id);
        currentItem.expanded = !currentItem.expanded;
    }

    function addItem(input) {
        Item.create(input);
        this.items = [...this.items, {...input}];
        console.log(this.items);
    }

   

    return {
        items,
        searchTerm,
        filterRating,
        addItemForm,
        error,   
        
        addItem,
        toggleExpanded,
        setSearchTerm,
        toggleAddItemForm,
        setFilterRating,
        findAndDelete,
        setError

    }
}());