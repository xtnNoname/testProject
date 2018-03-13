//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var request = require('request');
var cookies = request.jar();
const util = require('util');
var io = require("socket.io-client");
console.log('');

request.post({
        url: 'http://127.0.0.1:3000/thing/login',
        jar: cookies,
        form: {
            ref: 'webthing',
            password: 'password'
        }
    },
    function(err, res, body) {
        console.log('');
        console.log('post request: ');
        console.log('');
        if (err) {
            console.log('Error: ', err);
            process.exit(0);
        }
        console.log('Status code: ', res.statusCode);
        console.log('');
        console.log('Headers: ', res.headers);
        console.log('');
        console.log('Cookies: ', cookies);
        console.log('');
        console.log('body: ', res.body);
        console.log('');

        // let's assume that the client page, once rendered, knows what room it wants to join
        var room = "webthing";

        var cookie = cookies._jar.store.idx['127.0.0.1']['/']['connect.sid'];
        var socket = io.connect("http://127.0.0.1:3000/thing/home", {
            reconnect: true,
            forceNew: true,
            extraHeaders: {
                Cookie: cookie
            }
        });
        console.log("connecting");
        socket.on('connect', function() {
            console.log("Eureka !!!");
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', room);

            socket.on('joined', function(data) {

                if (data) {
                    console.log("join");
                    setInterval(function() {
                        console.log("emitting");
                        var values = { "date": new Date(), "value": generate(201) };
                        values = JSON.stringify(values);
                        socket.emit('data', { room: room, msg: values });

                    }, 1000);
                }
            });

        });

        socket.on('disconnect', function() {
            console.log("down !!!");

        });
        socket.on('error', function(data) {
            console.log("error: ");
            console.log(data || 'error');
        });

        socket.on('connect_failed', function(data) {
            console.log("failed: ");
            console.log(data || 'connect_failed');
        });


        //process.exit(0);
    }
);

function generate(n) {
    return Math.floor(Math.random() * n) - 100;
};
