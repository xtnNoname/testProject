// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
// load the user model
//var User = require('./../models/user');
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
    passport.serializeUser(function(thing, done) {
        console.log('serialize:' + thing);
        done(null, {
            "id": thing.id,
            "name": thing.get('name')
        });
    });

    // used to deserialize the user
    passport.deserializeUser(function(thing, done) {
        console.log('deserialize' + thing.id);
        var err = null;
        var sessionuUser = Thing.findById(thing.id);
        if (!sessionuUser) {
            err = 'no thing found';
            done(err, sessionuUser);
        }
        done(err, sessionuUser);
    });


    // =========================================================================
    // LOCAL THING LOGINUP =====================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('thing-loginup', new BasicStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'ref',
            passwordField: 'password',
            passReqToCallback: true, // allows us to pass back the entire request to the callback

        },
        function(req, thingid, password, done) {
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
