'use strict'
/* global store, Item, bookmarkList, api */

const Item = (function(){
    const create = function(input) {
        return {
            id: input.id,
            title: input.title,
            rating: input.rating,
            website: input.website,
            description: input.desc,
            expanded: false,
        };
    }

    return{
        create,
    }
}());
