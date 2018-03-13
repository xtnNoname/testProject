var ThingData = require('./../models/mongo/ThingData');

module.exports = function(io) {

    console.log("loading socket server...");

    // configuring namespaces ==================================================

    var things = io.of('/thing/home');

    // handling sockets ========================================================

    // handle incoming connections from clients
    io.on('connection', function(socket) {
        console.log('client connected: ');

        socket.on('disconnect', function() {
            console.log('client has disconnected');
        });
    });

    // handle incoming connections from things
    things.on('connection', function(socket) {
        console.log('thing connected: ');
        //console.log("clients: ", things.clients('abc123'));
        socket.on('room', function(room) {

            if (socket.request.user.logged_in) {
                var thingId = socket.request.user._rejectionHandler0._rejectionHandler0.get('ref');
                if (socket.room != "undefined" || typeof thingId == "undefined") {
                    socket.leave(socket.room);
                }
                console.log("room", room);

                socket.join(room, function() {
                    //socket.emit('joined', true);

                    if (typeof thingId != "undefined") {
                        console.log("joined");
                        things.to(socket.id).emit('joined', true);
                        socket.broadcast.to(room).emit('join', { joined: true, obj: thingId });
                    } else {
                        socket.room = room;
                    }
                });
            } else {
                socket.disconnect();
            }

        });


        socket.on('data', function(data) {
            var thingId = socket.request.user._rejectionHandler0._rejectionHandler0.get('ref');
            socket.broadcast.to(data.room).emit('data', data.msg);
            ThingData.create({ ref: thingId, data: JSON.parse(data.msg) }, function(err, instance) {
                if (err) return console.error(err);
                console.log("received ", instance);
                // saved!
            });

        });



        // disconnected
        socket.on('disconnect', function() {
            var thingId = socket.request.user._rejectionHandler0._rejectionHandler0.get('ref');

            if (typeof thingId != "undefined") {
                console.log('user has disconnected', thingId);
                socket.broadcast.to('abc123').emit('join', { joined: false, obj: thingId });
            }
            /*

            if (typeof thingId != "undefined") {
                socket.broadcast.to('abc123').emit('joined', { joined: false, obj: thingId });
            }
            */
        });
    });


}
