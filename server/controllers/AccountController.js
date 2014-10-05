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
                return res.render('account/message', { message: 'Invalid activation key. Please contact administrator.'});
            }

            if(user) {

                user.confirmationId = undefined;
                user.confirmationDate = new Date();
                user.save();

                return res.render('account/message', { message: 'Account Activated! Please proceed to the <a href="/login">login page</a> to sign in.'});
            }
            else {
                return res.render('account/message', { message: 'Invalid activation key. Please contact administrator.'});
            }

        });

    };

    var getForgotPassword = function(req, res) {
        return res.render('account/forgot_password');
    };

    var postForgotPassword = function(req, res) {

        var email = req.param('email');

        if(email) {
            User.findOne({ email: email }, function(err, user) {

                var resetTime = new Date();
                resetTime.setTime(resetTime.getMinutes() + 30);

                user.passwordResetId = encrypt.createGuid();
                user.passwordResetExpires = resetTime;
                user.save();

                jade.renderFile('server/views/emails/passreset.jade', { reset_link: 'http://auth.spaceshipsamurai.com/account/password/reset/' + user.passwordResetId }, function(err, text) {

                    if(err) {
                        console.log(err);
                    }
                    else {

                        mailer.send({
                            from: 'noreply@spaceshipsamurai.com',
                            fromname: 'Spaceship Samurai',
                            to: req.body.email,
                            subject: 'Password Reset',
                            text: text
                        }, function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });

                    }

                });
            });
        }

        return res.render('account/message', { message: 'A password reset email has been sent to the specified email.' })
    };

    var getPasswordReset = function(req, res) {

        if(!req.params.id) {
            return res.render('account/message', { message: 'Invalid/Expired password reset link'});
        }

        User.findOne({ passwordResetId: req.params.id }, function(err, user) {

            if(err || !user) {
                return res.render('account/message', { message: 'Invalid/Expired password reset link'});
            }

            if(user.passwordResetExpires < new Date()) {
                user.passwordResetId = undefined;
                user.passwordResetExpires = undefined;
                return res.render('account/message', { message: 'Invalid/Expired password reset link'});
            }

            return res.render('account/pass_reset', { pass_key: req.params.id });

        });

        return res.render('account/pass_reset', { pass_key: req.params.id });
    };

    var postPasswordReset = function(req, res) {

        console.log('KEY: ' + req.param('key'));
        console.log('PASS: ' + req.param('password'));
        console.log('CON: ' + req.param('confirm'));

        if(!req.param('key') || !req.param('password') || !req.param('confirm')) {
            return res.render('account/message', { message: 'Error resetting password'});
        }
        console.log('test');
        User.findOne({ passwordResetId: req.param('key')}, function(err, user) {

            if(err) {
                console.log(err);
                return res.render('account/message', { message: 'Error resetting password'});
            }

            if(!user) {
                return res.render('account/message', { message: 'Error resetting password'});
            }

            if(req.param('password') != req.param('confirm')) {
                return res.render('account/pass_reset', { pass_key: req.param('key'), error_message: 'Passwords do not match' });
            }

            user.password = encrypt.hashValue(req.param('password'), user.salt);
            user.save();

            return res.render('account/message', { message: 'Password reset. Please proceed to the <a href="/login">login page</a> to sign in.'})

        })

    };

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
        activate: activate,
        getForgotPassword: getForgotPassword,
        postForgotPassword: postForgotPassword,
        getPasswordReset: getPasswordReset,
        postPasswordReset: postPasswordReset
    }
};

