var Thing = require('./../models/thing');
var io = require('socket.io');
module.exports = {
    Data: function(req, res) {
        console.log('data');
        Thing.findAll()
            .then(function(results) {
                var json = JSON.stringify(results);
                results = JSON.parse(json);
                console.log(results);
                res.render('things/index', {
                    data: results
                });
            })
            .catch(function(error) {
                res.send('ERROR!' + error); // Hand your error better than this please
            });

    },

    Index: function(req, res) {
        res.render('things/thing', {

        });

    },

    Login: function(req, res) {

        res.render('things/login', {
            message: req.flash('loginMessage')
        });
    }

}
