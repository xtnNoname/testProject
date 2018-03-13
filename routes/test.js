var express = require('express');
var router = express.Router();
thingIsPermitted = require('./../middleware/thingIsPermitted').thingIsPermitted;

// load controllers
require('./../helpers/controllersLoader');
// Routes
module.exports = function(app, passport, io) {

    // Main Routes
    router.route('/')
        .get(thingIsPermitted, testController.Index);
    router.route('/login')
        .post(function(req, res, next) {
            console.log('');
            console.log("post request: ");
            console.log('');
            console.log(req.body);
            console.log('');
            passport.authenticate('thing-loginup', function(err, user, info, status) {
                console.log('thing-loginup');
                console.log(err);
                console.log('user: ');
                console.log(user);
                console.log('info: ');
                console.log(info);
                console.log('status: ');
                console.log(status);
                if (err) { console.log("auth error"); return next(err) }
                if (!user) { console.log("no user"); return res.status(404) }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    console.log("auth successful");
                    console.log(req.session.passport.user.id);
                    return next();
                });
            })(req, res, next)
        }, testController.Login);
    router.route('/home')
        .get(thingIsPermitted, testController.Home);
    router.route('/data')
        .get(testController.Data);

    return router;
};
