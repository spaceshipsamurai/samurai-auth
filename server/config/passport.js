var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    config = require('../config/config').getConfig();

module.exports = function () {
    passport.use(new LocalStrategy(function (email, password, done) {
        var User = mongoose.model('User');
        User.findOne({ email: email}, function (err, user) {

            if (err || !user || !user.authenticate(password)) {
                return done(null, false);
            }

            console.log('User authenticated');
            return done(null, user);

        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        var User = mongoose.model('User');
        User.findById(id, function(err, user){
            done(err, user);
        });

    });

};
