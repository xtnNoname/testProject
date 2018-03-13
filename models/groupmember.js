'use strict';

var Bookshelf = require('./../database/bookshelf');

var Groupmember = Bookshelf.extend({
    tableName: 'groupmember',
    hasTimestamps: ['createdAt', 'updatedAt'],
    /*
    validate: {


    }
    */


}, {

}, {
    /*
    findById: function(id) {
        return this.forge().query({
            where: {
                id: id
            }
        }).fetch();
    }
    */
});

module.exports = Groupmember //Bookshelf.model('User', user);
