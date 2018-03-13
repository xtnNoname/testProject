// route middleware to make sure a thing is permitted to connect
exports.thingIsPermitted = function(req, res, next) {
    console.log("thingIsPermitted");
    // if thing is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('');
        console.log("thing connected successfuly");
        console.log('');
        return next();
    }

    console.log("thing is not paermitted");
    // if it isn't send 401 Unauthorized Http code
    //res.redirect('/things/login');
    return res.status(401).send('Unauthorized');
}
