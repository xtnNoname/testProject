// route middleware to make sure a user is logged in
exports.isLoggedIn = function(req, res, next) {
    console.log("isLoggedIn");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('session available');
        console.log(req.params.username, req.session.passport.user.name);
        if (req.params.username === req.session.passport.user.name) {
            console.log('all is good');
            return next();
        } else {
            console.log('session not matched');
            return res.status(404).render('404', {
                url: req.url
            });
        }
    }

    // if they aren't redirect them to the home page
    res.redirect('/signin');
}
// route middleware to make sure a logged in user can't signin/up
exports.isSignedIn = function(req, res, next) {
    console.log("isSignedIn");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        backURL = req.header('Referer') || '/';
        // do your thang
        return res.redirect(backURL);
    }

    // if they aren't redirect them to the home page
    return next();
}

exports.isConnected = function(req, res, next) {
    console.log("isLoggedIn");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('all is good');
        req.connected = '200';
        return next();
    }

    // visitor
    console.log('not connected');
    req.connected = '404';
    return next();
}
