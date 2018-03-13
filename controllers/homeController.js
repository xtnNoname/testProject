var Device = require('./../models/device');
module.exports = {
    load: function(req, res) {
        Device.where({
                userId: req.session.passport.user.id
            })
            .fetchAll({ columns: ['status'] })
            .then(function(devices) {
                devices = devices.toJSON();
                res.render('pages/home', {
                    userName: req.params.username,
                    name: req.session.passport.user.lname,
                    devices: JSON.stringify(devices),
                    title: "home"
                });
            });

    },
    welcome: function(req, res) {
        if (req.connected === '200') {
            return res.render('pages/welcome', {
                connection: "<a href='/signout'>DECONNEXION</a>"
            });
        } else {
            return res.render('pages/welcome', {
                connection: "<a href='/signin'>CONNEXION</a>"
            });

        }

    }
}
