var dbConfig = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'iot',
        charset: 'utf8'
    },
    migration: {
        directory: './../models/migrations'
    }
}
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);
// Pass an initialized bookshelf instance
//var ModelBase = require('bookshelf-modelbase')(bookshelf);
// Or initialize as a bookshelf plugin
//bookshelf.plugin(require('bookshelf-modelbase').pluggable);
bookshelf.plugin('registry');
module.exports = require('bookshelf-modelbase')(bookshelf);
