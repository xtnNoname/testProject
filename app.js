const URL = 'mongodb://127.0.0.1/data';
const util = require('util');
var express = require('express');
var http = require('http');
var app = express();
var socketio = require('socket.io');
var passportSocketIo = require('passport.socketio');
var server = http.Server(app);
var io = socketio(server);
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');
var accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), { flags: 'a' }
) // create a write stream (in append mode)
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
//require('./database/mongo.js');
var passport = require('passport');
var flash = require('connect-flash');

var SQLiteStore = require('connect-sqlite3')(session);
var favicon = require('serve-favicon');
var ECT = require('ect');
var ectRenderer = ECT({
    watch: true,
    root: __dirname + '/views',
    ext: '.hbs',
    open: '{{',
    close: '}}'
});

// configuration ===============================================================



//Set up default mongoose connection
mongoose.connect(URL);


//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
/*
db.once('open', function() {
SomeModel.create({ name: 'also_awesome' }, function (err, awesome_instance) {
if (err) return handleError(err);
// saved!
});
});
*/

// some environment variables
//app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
// set the view engine to ejs
/*
app.engine('hbs', handelbars({
    extname: 'hbs',
    defaultLayout: __dirname + '/views/layouts/dashboard',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
*/
app.engine('hbs', ectRenderer.render);
app.set('view engine', 'hbs');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));


// parse request bodies (req.body)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
// allow overriding methods in query (?_method=put)
/*
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
*/

// session support
var sessionStore = new SQLiteStore({
    db: 'sessions',
    dir: 'C:/Users/B.X/Desktop/Dev_Playground/sqlite'
});
var socketStore = new SQLiteStore({
    db: 'sockets',
    dir: 'C:/Users/B.X/Desktop/Dev_Playground/sqlite'
});
var sharedSessions = session({
    key: 'connect.sid',
    store: sessionStore,
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    secret: 'thingstream'
});
/*

 */


/*
io.use(function(socket, next) {
    console.log("req: ");
    console.log("reqres: ");
    sharedSessions(socket.request, socket.request.res, next);
});
 */

app.use(sharedSessions);
// pass passport for configuration
require('./middleware/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
// socket.io configuration ==========================================

/*
io.use(function(socket, next) {
    // Wrap the express middleware
    console.log('');
    console.log('socket io: ', socket.request.headers);
    console.log('');
    console.log('xdomain: ', socket.handshake.xdomain);
    sharedSessions(socket.request, {}, next);
});
*/

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid',
    secret: 'thingstream',
    store: sessionStore,
    passport: passport,
    success: onAuthorizeSuccess, // *optional* callback on success - read more below
    fail: onAuthorizeFail // *optional* callback on fail/error - read more below
}));


function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    // If you use socket.io@1.X the callback looks different
    accept();
};

function onAuthorizeFail(data, message, error, accept) {
    if (error)
        throw new Error(message);
    console.log('failed connection to socket.io:', message);
    // If you use socket.io@1.X the callback looks different
    if (error)
        accept(new Error(message));
};

require('./helpers/sockets')(io);

// routes ======================================================================
// load routes
console.log('loading routes...');

//app.use('/things', require('./routes/things')(passport, io));
app.use('/', require('./routes/web')(app, passport, io));
//app.use('/api', require('./routes/api')(app));
app.use('/thing', require('./routes/test')(app, passport, io));


app.use(function(err, req, res, next) {
    // log it
    console.error(err.stack);

    // error page
    res.status(500).render('5xx', {
        title: "500"
    });
});

// assume 404 since no middleware responded
app.use(function(req, res, next) {
    res.status(404).render('404', {
        title: "404",
        url: req.originalUrl
    });
});

// server ==========================================
//starting server
server.listen(3000, function() {
    console.log('server started on port 3000');
});
