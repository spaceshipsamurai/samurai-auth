var passport = require('passport'),
    KeyService = require('../services/eve/key-service'),
    Membership = require('../services/account/membership-service');
    Promise = require('bluebird');

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

exports.getCurrentUser = function(req, res, next) {

    var user = {};

    if(req.user)
    {
        user.email = req.user.email;
        user.character = req.user.character;
        user.services = req.user.services;
        user.primary = req.user.primary;
        user._id = req.user._id;
    }
    else
    {
        return res.send(user);
    }


    Promise.props({
        characters: [],
        groups: Membership.getActiveMembershipsByUser(req.user._id),
        pending: Membership.getPendingByUser(req.user._id)
    }).then(function(result){
        user.characters = result.characters;
        user.groups = result.groups;
        user.pending = result.pending;
        res.json(user);
    }).catch(function(err){
        next({ msg: err, tags: ['auth', 'session']})
    });

};

exports.logout = function(req, res) {
    req.logout();
    res.clearCookie('ag-user');
    res.redirect('/login');
};