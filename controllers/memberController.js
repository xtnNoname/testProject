var Groupmember = require('./../models/groupmember');
var Memberdevice = require('./../models/memberdevice');
var Device = require('./../models/device');
var User = require('./../models/user');
// Create an object type MyException
function MyException(message, thing) {
    this.thing = thing;
    this.message = message;
    this.name = 'MyException';
};
MyException.prototype.toString = function() {
    return this.name + ': "' + this.message + '"' + JSON.stringify(this.thing);
};

module.exports = {

    //load ===============================
    load: function(req, res) {
        console.log("loading members");
        Groupmember.where({
                groupAdmin: req.session.passport.user.id,
                active: '1'
            })
            .fetchAll({ columns: ['memberId'] })
            .then(function(gmembers) {
                gmembers = gmembers.toJSON();
                var ids = Object.keys(gmembers).map(function(k) {
                    return gmembers[k].memberId
                });
                if (gmembers.length === 0) {
                    res.render('pages/group', {
                        userName: req.session.passport.user.name,
                        members: JSON.stringify({}),
                        title: "group"
                    });
                } else {
                    console.log("members found");
                    User.query()
                        .whereIn(
                            'id',
                            ids
                        )
                        .then(function(members) {
                            members.map(function(i, j) {
                                i.id = j + 1;
                            });
                            res.render('pages/group', {
                                userName: req.session.passport.user.name,
                                members: JSON.stringify(members),
                                title: "group"
                            });
                        })
                        .catch(function(error) {
                            console.log('error');
                            console.log(error);
                            return error; // Hand your error better than this please
                        });
                }


            })
            .catch(function(error) {
                console.log('model error');
                console.log(error);
                return error; // Hand your error better than this please
            });
    },

    //accept ===============================
    accept: function(req, res) {

        new Groupmember().where({
                active: "0",
                groupAdmin: req.body.admin,
                memberId: req.session.passport.user.id
            })
            .save({
                active: "1"
            }, {
                method: "update",
                patch: true
            })
            .then(function(group) {
                console.log(group.toJSON());
                return res.status(200).json({
                    admin: req.body.admin,
                    msg: "vous ètes inscrit au group"
                })
            })
            .catch(function(error) {
                res.status(500).send("échec d'inscription au group")
            });
    },
    //ignore ===============================
    ignore: function(req, res) {

        Groupmember.query()
            .where({
                active: "0",
                groupAdmin: req.body.admin,
                memberId: req.session.passport.user.id
            })
            .del()
            .then(function(data) {
                console.log('ignore: ', data);
                if (data > 0) {
                    console.log(">0");
                    res.status(200).json({
                        admin: req.body.admin,
                        msg: "invitation supprimer"
                    });
                } else {
                    console.log("<0");
                    res.status(500).json({
                        admin: req.body.admin,
                        msg: "invitation introuvable"
                    });
                }

            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send("échec d'ignoration")
            });
    },

    //create ===============================
    create: function(req, res) {
        console.log("invite member");
        var admin = req.session.passport.user.id;
        var name = req.body.userName;

        User.findOne({
                'userName': name
            })
            .then(function(user) {
                user = user.toJSON();
                // check to see if theres already a user with that email
                Groupmember.create({
                        active: '0',
                        groupAdmin: admin,
                        adminName: req.session.passport.user.name,
                        memberId: user.id,
                        memberName: name
                    })
                    .then(function(member) {
                        res.status(200).send("invitation envoyée");
                    })
                    .catch(function(error) {
                        console.log('error create member:');
                        //console.log(error);
                        if (error.code === 'ER_DUP_ENTRY')
                            res.status(500).send("membre déja inscrit à un groupe") // Hand your error better than this please
                        else {
                            res.status(500).send("échec d'invitation");
                        }
                    });

            })
            .catch(User.NotFoundError, function(error) {
                // if there is no user with that name
                console.log('error not found');
                res.status(500).send("membre invalide");
            })
            .catch(function(error) {
                console.log('last error');
                res.status(500).send("échec d'invitation"); // Hand your error better than this please
            });

    },

    //update ===============================
    update: function(req, res) {
        res.render('pages/group', {

        });
    },

    //delete ===============================
    delete: function(req, res) {
        console.log("delete member");
        Groupmember.query()
            .whereIn(
                'memberName',
                req.body.data
            ).andWhere('groupAdmin', '=', req.session.passport.user.id)
            .del()
            .then(function(data) {
                console.log(data);
                res.send("supprimer avec succès");
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send("échec de suppression")
            });
    },

    //assign ===============================
    assign: function(req, res) {
        console.log("assign device(s)");
        Device.query()
            .whereIn(
                'ref',
                req.body.data
            )
            .andWhere('userId', '=', req.session.passport.user.id)
            .then(function(devices) {
                Groupmember.findOne({
                        'groupAdmin': req.session.passport.user.id,
                        'memberName': req.body.member
                    })
                    .then(function(data) {
                        data = data.toJSON();
                        console.log(data.groupAdmin);
                        var chk = true;
                        try {
                            devices.map(function(k) {
                                Memberdevice.create({
                                        deviceId: k.id,
                                        groupMemberId: data.id
                                    })
                                    .catch(function(error) {
                                        chk = false;
                                        delete k.id;
                                        delete k.userId;
                                        throw new MyException("error creating device :", k);
                                    })
                            });
                        } catch (e) {
                            if (e.name === "MyException") {
                                return res.status(500).send("échec d'assigner device :" + e.device)
                            }
                            return res.status(500).send("échec d'assignement ")
                        } finally {
                            if (chk === true)
                                res.status(200).send("assignement avec succés")
                        }
                    })
                    .catch(User.NotFoundError, function(error) {
                        // if there is no user with that name
                        console.log('error not found');
                        res.status(500).send('membre invalide')
                    })
                    .catch(function(error) {
                        console.log('error');
                        console.log(error);
                        res.status(500).send('internal error'); // Hand your error better than this please
                    });

            })
            .catch(function(error) {
                console.log('last error');
                console.log(error);
                res.status(500).send('device(s) invalide(s)'); // Hand your error better than this please
            });

    }

    //export end
}
