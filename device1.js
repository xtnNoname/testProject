//client.js
var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000', {
    reconnect: true
});
console.log("started");
// Add a connect listener
socket.on('connect', function(socket) {
    console.log('Connected!');

});
socket.on('error', function(error) {
    console.log("error");
    console.log(error);
});
socket.on('connect_error', function(error) {
    console.log("connect_error");
    console.log(error);
});

socket.emit('CH01', 'me', 'test msg');
console.log("finished");
