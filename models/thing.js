'use strict';

var Bookshelf = require('./../database/bookshelf');
var bcrypt = require('bcrypt-nodejs');

var Thing = Bookshelf.extend({
    tableName: 'device',
    hasTimestamps: ['createdAt', 'updatedAt'],
    /*
    validate: {


    }
    */

    verifyPassword: function(password) {
        return this.get('password') === password;
    },
    Hash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
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

module.exports = Thing //Bookshelf.model('User', user);
