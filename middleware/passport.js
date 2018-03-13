// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
// load the user model
var User = require('./../models/user');
var Group = require('./../models/group');
// load the thing model
var Thing = require('./../models/thing');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(model, done) {
        console.log('serialize:' + model);
        var uN = model.get('userName');
        if (typeof uN === 'string' && uN.length) {
            console.log("its a Member !");
            done(null, {
                "id": model.id,
                "name": uN,
                "lname": model.get('lastName')
            });
        } else {
            console.log("its a Thing !");
            done(null, {
                "id": model.id,
                "ref": model.get('ref'),
                "userId": model.get('userId'),
            });
        }

    });

    // used to deserialize the user
    passport.deserializeUser(function(model, done) {
        console.log('deserialize' + model.id);
        var err = null;
        if (model.hasOwnProperty('name') && typeof model.name === 'string' && model.name.length) {
            console.log("its a Member !");
            var session = User.findById(model.id);
        } else {
            console.log("its a Thing !");
            var session = Thing.findById(model.id);
        }

        if (!session) {
            err = 'no user found';
            console.log('no model found');
            return done(err, session);
        }
        console.log('model found');
        return done(err, session);
    });


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists

                User.findOne({
                        'email': email
                    }).then(function(user) {
                        console.log('fetching');
                        // check to see if theres already a user with that email
                        if (user) {
                            console.log('user already exists');
                            return done(null, false, req.flash('signupMessage', 'cette email existe déja'));
                        };
                    })
                    .catch(User.NotFoundError, function(error) {
                        // if there is no user with that email
                        // create the user
                        console.log("creating user");
                        //var newUser = new User();

                        // set the user's local credentials
                        var mail = email;
                        var pass = User.hash(password);
                        var first = req.body.firstName;
                        var last = req.body.lastName;
                        var user = req.body.userName;
                        // save the user
                        User.create({
                            "email": mail,
                            "password": pass,
                            "firstName": first,
                            "lastName": last,
                            "userName": user,

                        }).then(function(newUser) {
                            console.log('no error ', newUser.id);
                            console.log(user);
                            var gId =
                                Group.create({
                                    "groupId": newUser.id,
                                    "groupName": user
                                }).then(function(group) {
                                    console.log("no group error");
                                    // all is well, return successful user
                                    return done(null, newUser);
                                }).catch(function(error) {
                                    console.log('error creating group');

                                    return done(null, false, req.flash('signupMessage', "erreur lors de l'inscription")); // Hand your error better than this please
                                });

                        }).catch(function(error) {
                            console.log('error creating user');
                            return done(null, false, req.flash('signupMessage', "erreur lors de l'inscription")); // Hand your error better than this please
                        });
                    })
                    .catch(function(error) {
                        console.log('error');
                        return done(null, false, req.flash('signupMessage', "erreur lors de l'inscription")); // Hand your error better than this please
                    });

            });

        }));




    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.where({
                    'email': email
                }).fetch()
                .then(function(user) {
                    console.log('fetching');
                    if (!user) {
                        console.log('user not found');
                        return done(null, false, req.flash('loginMessage', 'utilisateur non trouvé')); // req.flash is the way to set flashdata using connect-flash

                    }
                    // if the user is found but the password is wrong
                    console.log("password: " + User.hash('2222'));

                    if (!user.verifyPassword(password)) {
                        console.log('found but pass is wrong');
                        return done(null, false, req.flash('loginMessage', 'Oops! mot de passe incorrecte.')); // create the loginMessage and save it to session as flashdata

                    }
                    console.log('no error');
                    // all is well, return successful user
                    return done(null, user);

                })
                .catch(function(error) {
                    console.log('error');
                    return done(null, false, req.flash('loginMessage', "erreur lors de la connexion.")); // Hand your error better than this please
                });


        }));




    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('thing-loginup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'ref',
            passwordField: 'password',
            passReqToCallback: true, // allows us to pass back the entire request to the callback

        },
        function(req, thingid, password, done) {
            console.log("thing logging...");
            Thing.where({
                    'ref': thingid
                }).fetch()
                .then(function(thing) {
                    console.log('fetching');
                    if (!thing) {
                        console.log('thing not found');
                        return done(null, false, req.flash('loginMessage', 'utilisateur invalide.')); // req.flash is the way to set flashdata using connect-flash

                    }
                    // if the user is found but the password is wrong
                    /*if (!thing.verifyPassword(password)) {
                        console.log('found but pass is wrong');
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    }*/
                    console.log('no thing error');
                    // all is well, return successful user
                    return done(null, thing);

                })
                .catch(function(error) {
                    console.log('thing error');
                    return done(null, false, req.flash('loginMessage', 'erreur lors de la connexion.')); // Hand your error better than this please
                });
        }
    ));



};
