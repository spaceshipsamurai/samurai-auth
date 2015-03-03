var Profiles = require('../../services/account/profile-service');

var exports = module.exports;

exports.rebuildProfile = function(req, res, next) {

    Profiles.rebuildProfile(req.user._id)
        .then(function(){
            res.json({ message: 'success' })
        }).catch(next);

};