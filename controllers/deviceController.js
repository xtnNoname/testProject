var Device = require('./../models/device');
var Groupmember = require('./../models/groupmember');
const util = require('util');
module.exports = {
    //load ===============================
    load: function(req, res) {
        console.log("loading devices");
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
                Groupmember.where({
                        groupAdmin: req.session.passport.user.id,
                        active: '1'
                    }).fetchAll({ columns: ['memberName'] })
                    .then(function(gmembers) {
                        gmembers = gmembers.toJSON();
                        res.render('pages/devices', {
                            userName: req.session.passport.user.name,
                            devices: JSON.stringify(devices),
                            members: JSON.stringify(gmembers),
                            title: "devices"
                        });
                    })

            });
    },

    //show ===============================
    show: function(req, res) {
        res.render('pages/devices', {

        });
    },

    //create ===============================
    create: function(req, res) {
        console.log("add device");
        req.body.status = '0';
        req.body.userId = req.session.passport.user.id;
        Device.create(req.body)
            .then(function(device) {
                device = device.toJSON();
                delete device.id;
                delete device.userId;
                device.status = "non connecté";
                console.log(device);
                res.status(200).json({
                    device: device,
                    msg: "ajout avec succès"
                });
            })
            .catch(function(error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(500).send("déja enregistrer")
                } else {
                    console.log(error);
                    res.status(500).send("échec d'ajout")
                }
            });
    },

    //update ===============================
    update: function(req, res) {
        console.log("update device");
        if (req.body.name === 'name') {
            new Device().where({
                    ref: req.body.pk,
                    userId: req.session.passport.user.id
                })
                .save({
                    name: req.body.value
                }, {
                    method: "update",
                    patch: true
                })
                .then(function(device) {
                    console.log(device.toJSON());
                    return res.status(200).send("mise à jours avec succès")
                })
                .catch(function(error) {
                    res.status(500).send("échec de mise à jours")
                });

        } else {
            return res.status(500).res.send("paramètre invalide");
        }
    },

    //delete ===============================
    delete: function(req, res) {
        console.log("delete device");
        Device.query()
            .whereIn(
                'ref',
                req.body.data
            )
            .andWhere('userId', '=', req.session.passport.user.id)
            .del()
            .then(function(data) {
                res.status(200).send("device supprimer");
            })
            .catch(function(error) {
                res.status(500).send("échec de suppression")
            });
    }

    //export end
}
