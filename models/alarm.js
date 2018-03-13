'use strict';

var Bookshelf = require('./../database/bookshelf');


var Alarm = Bookshelf.extend({
    tableName: 'alarm',
    hasTimestamps: ['createdAt', 'updatedAt'],
    /*
    validate: {


    }
    */


});

module.exports = Alarm //Bookshelf.model('User', user);
