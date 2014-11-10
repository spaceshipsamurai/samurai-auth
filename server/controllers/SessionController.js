var passport = require('passport'),
    GroupManager = require('../services/membership/GroupManager');

exports.authenticate = function(req, res, next) {

    if(!req.body.email || !req.body.password)
    {
        return res.status(400).send({success: false});
    }

    req.body.username = req.body.email.toLowerCase();

    var auth = passport.authenticate('local', function(err, user){
        if(err) { return next(err); }

        if(!user){
            res.status(403);
            return res.send({success: false })
        }

        if(!user.confirmationDate) {
            res.status(403);
            return res.send({success: false, errors: [ 'Account inactive. Please make sure you clicked the activation link in the email.']})
        }

        req.logIn(user, function(err) {
            if(err) { return next(err); }
            res.send({success: true, user: user });
        })
    });

    auth(req, res, next);
};

exports.getCurrentUser = function(req, res) {

    var user = {};

    if(req.user)
    {
        user.email = req.user.email;
        user.character = req.user.character;
    }
    else
    {
        return res.send(user);
    }

    GroupManager.getGroupsByUser(req.user._id).then(function(groups){
        user.groups = groups;
        res.send(user);
    }).error(function(err){
        res.send(user);
    });

};

exports.logout = function(req, res) {
    req.logout();
    res.clearCookie('ag-user');
    res.redirect('/login');
};