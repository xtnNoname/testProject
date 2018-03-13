'use strict';

var Bookshelf = require('./../database/bookshelf');


var Group = Bookshelf.extend({
    tableName: 'usergroup',
    hasTimestamps: ['createdAt', 'updatedAt'],
    /*
    validate: {


    }
    */


});

module.exports = Group //Bookshelf.model('User', user);
