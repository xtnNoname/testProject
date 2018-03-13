'use strict';

var Bookshelf = require('./../database/bookshelf');

var Memberdevice = Bookshelf.extend({
    tableName: 'Memberdevice',
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

module.exports = Memberdevice //Bookshelf.model('User', user);
