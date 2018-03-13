var express = require('express');
var router = express.Router();
isLoggedIn = require('./../middleware/routePermissions').isLoggedIn;
isSignedIn = require('./../middleware/routePermissions').isSignedIn;
isConnected = require('./../middleware/routePermissions').isConnected;
// load controllers
require('./../helpers/controllersLoader');
// Routes
module.exports = function(app, passport, io) {

    //welcome page =================================================================
    router.route('/')
        .get(isConnected, homeController.welcome);
    router.route('/welcome')
        .get(isConnected, homeController.welcome);
    //sign ==============================================================
    //in
    router.route('/signin')
        .get(isSignedIn, userController.signin)
        .post(isSignedIn, passport.authenticate('local-login', {
            failureRedirect: '/signin', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }), function(req, res) {
            req.params.username = req.session.passport.user.name;

            res.redirect('/dashboard/' + req.params.username + '/home');
        });
    //up
    router.route('/signup')
        .get(isSignedIn, userController.signup)
        .post(isSignedIn, passport.authenticate('local-signup', {
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }), function(req, res) {
            req.params.username = req.session.passport.user.name;

            res.redirect('/dashboard/' + req.params.username + '/home');
        });
    //out
    router.route('/signout').all(function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //dashboard ====================================================================
    //home
    router.route('/dashboard/:username/home')
        .get(isLoggedIn, homeController.load);
    //data
    router.route('/dashboard/:username/data')
        .get(isLoggedIn, dataController.load);
    router.route('/dashboard/:username/data/:device')
        .get(isLoggedIn, dataController.show);
    //device
    router.route('/dashboard/:username/devices')
        .get(isLoggedIn, deviceController.load)
        .post(isLoggedIn, deviceController.create)
        .delete(isLoggedIn, deviceController.delete);
    router.route('/dashboard/:username/devices/:device')
        .get(isLoggedIn, deviceController.show)
        .put(isLoggedIn, deviceController.update);

    //member
    router.route('/dashboard/:username/group')
        .get(isLoggedIn, memberController.load)
        .post(isLoggedIn, memberController.create)
        .delete(isLoggedIn, memberController.delete);
    router.route('/dashboard/:username/group/:admin')
        .put(isLoggedIn, memberController.accept)
        .delete(isLoggedIn, memberController.ignore)
    router.route('/dashboard/:username/devices/:member')
        .post(isLoggedIn, memberController.assign);

    //archive
    router.route('/dashboard/:username/archive')
        .get(isLoggedIn, archiveController.load);
    router.route('/dashboard/:username/archive/:device')
        .get(isLoggedIn, archiveController.show);
    //alarm
    router.route('/dashboard/:username/alarms')
        .get(isLoggedIn, alarmController.load)
        .post(isLoggedIn, alarmController.upsert)
    router.route('/dashboard/:username/getAlarms')
        .get(isLoggedIn, alarmController.show)
    router.route('/dashboard/:username/alarms/:alarm')
        .get(isLoggedIn, alarmController.show)

        .put(isLoggedIn, alarmController.view)
        .delete(isLoggedIn, alarmController.delete);
    //user
    router.route('/dashboard/:username/user')
        .get(isLoggedIn, userController.show)
        .post(isLoggedIn, userController.create)
        .put(isLoggedIn, userController.update);

    /*
        router.route('/home')
            .get(isLoggedIn, userController.Index);

    */
    return router;
};
