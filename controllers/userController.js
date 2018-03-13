var User = require('./../models/user');
module.exports = {
    load: function(req, res) {
        console.log("load");
        res.render('pages/user', {
            userName: req.session.passport.user.name,
            title: "profile"
        });
    },
    show: function(req, res) {
        console.log("show");
        User.findOne({
                userName: req.session.passport.user.name
            })
            .then(function(user) {
                user = user.toJSON();
                delete user.id;
                delete user.password;
                console.log(user);
                res.render('pages/user', {
                    userName: req.session.passport.user.name,
                    user: user,
                    title: "profile"
                });
            })
            .catch(function(error) {
                console.log("error show");
                console.log(error);
                res.render('pages/user', {
                    userName: req.session.passport.user.name,
                    title: "profile"
                });
            })
    },
    create: function(req, res) {
        console.log("change password");
        console.log(req.body);
        var pass = User.hash(req.body.new);
        console.log(pass);
        User.update({
                password: pass
            }, {
                id: req.session.passport.user.id
            })
            .then(function(user) {
                console.log(user.toJSON());
                console.log("pass up");
                res.status(200).send("mot de passe changer")
            }).catch(function(error) {
                console.log("error");
                console.debug(error);
                res.status(200).send("écheck de mise à jours")
            });
    },
    update: function(req, res) {
        console.log("update user");
        User.update({
                firstName: req.body.first,
                lastName: req.body.last
            }, {
                id: req.session.passport.user.id
            })
            .then(function(user) {
                console.log("user up");
                console.log(user.toJSON());
                res.status(200).send("mise à jours avec success")
            }).catch(function(error) {
                console.log("error");
                console.debug(error);
                res.status(200).send("écheck de mise à jours")
            });

    },
    delete: function(req, res) {
        res.render('pages/user', {

        });
    },
    signin: function(req, res) {
        res.render('pages/signin', {
            flash: req.flash('loginMessage')
        });
    },
    signup: function(req, res) {
        res.render('pages/signup', {

        });
    }
}
