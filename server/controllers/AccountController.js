var encrypt = require('../services/encryption'),
    mailer = require('../services/mailer')(),
    jade = require('jade');

module.exports = function(User) {

    var showLogin = function(req, res) {
        res.render('login');
    };

    var activate = function(req, res) {

        var id = req.params.id;

        User.findOne({ confirmationId: id }, function(err, user){

            if(err) {
                console.log(err);
                return res.render('shared/message', { message: 'Invalid activation key. Please contact administrator.'});
            }

            if(user) {

                user.confirmationId = undefined;
                user.confirmationDate = new Date();
                user.save();

                return res.render('shared/message', { message: 'Account Activated! Please proceed to the <a href="/login">login page</a> to sign in.'});
            }
            else {
                return res.render('shared/message', { message: 'Invalid activation key. Please contact administrator.'});
            }

        });

    }

    var registerUser = function(req, res) {

        var salt = encrypt.createSalt();
        var hash = encrypt.hashValue(req.body.password, salt);
        var confirmId = encrypt.createGuid();

        User.create({
            email: req.body.email,
            password: hash,
            salt: salt,
            lastIP: '127.0.0.1',
            confirmationId: confirmId
        }, function(err) {
            if(err){
                console.log(err.message);

                if(err.message.indexOf('E11000') != -1)
                {
                    err.message = 'Email already in use';
                }

                res.status(400);
                return res.send({ success: false, message: err.message });
            }

            jade.renderFile('server/views/emails/confirmation.jade', { confirmation_link: 'http://auth.spaceshipsamurai.com/account/activate/' + confirmId }, function(err, text) {

                if(err) {
                    console.log(err);
                }
                else {

                    mailer.send({
                        from: 'noreply@spaceshipsamurai.com',
                        fromname: 'Spaceship Samurai',
                        to: req.body.email,
                        subject: 'Account Confirmation',
                        text: text
                    }, function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                }

            });

            return res.send({ success: true});
        });

    };

    return {
        showLogin: showLogin,
        registerUser: registerUser,
        activate: activate
    }
};

