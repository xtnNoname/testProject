'use strict';

var Bookshelf = require('./../database/bookshelf');
var bcrypt = require('bcrypt-nodejs');

var Device = Bookshelf.extend({
    tableName: 'device',
    hasTimestamps: ['createdAt', 'updatedAt'],
    /*
    validate: {


    }
    */
    verifyPassword: function(password) {
        return bcrypt.compareSync(password, this.get('password'));
    }

}, {
    hash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
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

module.exports = Device //Bookshelf.model('User', user);
