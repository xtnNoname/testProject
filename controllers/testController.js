var Thing = require('./../models/thing');
//var io = require('socket.io');
module.exports = {
    Index: function(req, res) {
        console.log('');
        console.log("thing index");
        console.log('');
        console.log("params: ");
        console.log(req.params);
        console.log('');
        console.log("body: ");
        console.log(req.body);
    },
    Login: function(req, res) {
        console.log('');
        console.log("thing login");
        console.log('');
        console.log("params: ");
        console.log(req.params);
        console.log('');
        console.log("body: ");
        console.log(req.body);
        console.log('');
        return res.status(200).send('authorized');
    },
    Home: function(req, res) {
        console.log('');
        console.log("thing home");
        console.log('');
        console.log("params: ");
        console.log(req.params);
        console.log('');
        console.log("body: ");
        console.log(req.body);
        console.log('');
        res.status(200).render('pages/thing', {

        })
    },
    Data: function(req, res) {
        console.log('');
        console.log('controllers');
        res.status(200).render('pages/thing');
    }

}
