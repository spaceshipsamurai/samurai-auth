var passport = require('passport');

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
            return res.send({success: false, message: 'Account inactive. Please make sure you clicked the activation link in the email.'})
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
    console.log(JSON.stringify(req.user, undefined, 2));

    if(req.user)
    {
        user.email = req.user.email;
        user.groups = req.user.groups;
    }

    res.send(user);
}

exports.logout = function(req, res) {
    req.logout();

    res.send({ success: true });
}