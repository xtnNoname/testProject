'use strict';

var Bookshelf = require('./../database/bookshelf');


var UserAlarm = Bookshelf.extend({
    tableName: 'useralarm',
    hasTimestamps: ['createdAt', 'updatedAt'],
    /*
    validate: {


    }
    */


});

module.exports = UserAlarm //Bookshelf.model('User', user);
