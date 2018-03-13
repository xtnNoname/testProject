var Alarm = require('./../models/alarm');
var UserAlarm = require('./../models/useralarm');
var Groupmember = require('./../models/groupmember');
var Device = require('./../models/device');
module.exports = {
    load: function(req, res) {
        UserAlarm.where({
                userId: req.session.passport.user.id
            })
            .fetchAll()
            .then(function(ualarms) {
                ualarms = ualarms.toJSON();
                var ids = Object.keys(ualarms).map(function(k) {
                    return ualarms[k].id
                });
                Alarm.query()
                    .whereIn(
                        'id',
                        ids
                    ).andWhere('status', '=', '0')
                    .then(function(alarm) {
                        var alarms = Object.keys(alarm).map(function(k) {

                            if (alarm[k].status === "0") {

                                Object.keys(ualarms).map(function(h) {
                                    if (ualarms[h].id === alarm[k].userAlarmId) {
                                        alarm[k].userAlarmId = ualarms[h]
                                    }
                                });
                                return alarm[k];
                            }
                        });
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
                                res.render('pages/alarms', {
                                    userName: req.session.passport.user.name,
                                    devices: JSON.stringify(devices),
                                    notifications: JSON.stringify(alarms),
                                    title: "alarms"
                                });

                            });
                    })
            });

    },
    upsert: function(req, res) {
        console.log("body ", req.body);
        console.log("min ", req.body.min);
        console.log("device ", req.body.device);
        UserAlarm.upsert({
            userId: req.session.passport.user.id,
            deviceId: req.body.device
        }, {
            description: req.body.desc,
            max: req.body.min,
            min: req.body.min,
            userId: req.session.passport.user.id,
            deviceId: req.body.device
        }).then(function(devices) {
            console.log('trigger success');
            res.status(200).send("creation avec succès")
        }).catch(function(error) {
            //console.log("error upsert", error);
            res.status(500).send("écheck lors de l'enregistrement")
        });

    },
    show: function(req, res) {
        UserAlarm.where({
                userId: req.session.passport.user.id
            })
            .fetchAll()
            .then(function(ualarms) {
                ualarms = ualarms.toJSON();
                var ids = Object.keys(ualarms).map(function(k) {
                    return ualarms[k].id
                });
                Alarm.query()
                    .whereIn(
                        'id',
                        ids
                    ).andWhere('status', '=', '0')
                    .then(function(alarm) {
                        console.log(alarm);
                        var alarms = Object.keys(alarm).map(function(k) {

                            if (alarm[k].status === "0") {

                                Object.keys(ualarms).map(function(h) {
                                    if (ualarms[h].id === alarm[k].userAlarmId) {
                                        alarm[k].userAlarmId = ualarms[h]
                                    }
                                });
                                return alarm[k];
                            }
                        });
                        console.log('alarms ', alarms);
                        Groupmember.where({
                                memberId: req.session.passport.user.id,
                                active: '0'
                            })
                            .fetchAll()
                            .then(function(invites) {
                                invites = invites.toJSON();
                                console.log(invites);
                                res.status(200).json({
                                    notifications: alarms,
                                    invitations: invites,
                                });
                            })

                    })
            });

    },
    view: function(req, res) {
        new Alarm().where({
                status: "0",
                id: req.body.alarm
            })
            .save({
                status: "1"
            }, {
                method: "update",
                patch: true
            })
            .then(function(group) {
                console.log(group.toJSON());
                return res.status(200).send("viewed")
            })
    },
    update: function(req, res) {

    },
    delete: function(req, res) {

    }
}
