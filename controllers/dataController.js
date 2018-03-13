var Device = require('./../models/device');
module.exports = {
    load: function(req, res) {
        Device.where({
                userId: req.session.passport.user.id
            })
            .fetchAll()
            .then(function(devices) {
                devices = devices.toJSON();
                devices.map(function(i, j) {
                    i.id = j + 1;
                    delete i.userId;
                    if (i.status === "0")
                        i.status = "non connecté"
                    else i.status = "connecté";
                });
                res.render('pages/data', {
                    userName: req.session.passport.user.name,
                    devices: devices,
                    title: "data"
                });
            });

    },
    show: function(req, res) {
        res.render('pages/data', {

        });
    },
    display: function(req, res) {
        res.render('pages/data', {

        });
    },
    create: function(req, res) {
        res.render('pages/data', {

        });
    },
    update: function(req, res) {
        res.render('pages/data', {

        });
    },
    delete: function(req, res) {
        res.render('pages/data', {

        });
    }
}
