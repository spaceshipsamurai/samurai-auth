var jabber = require('../../services/jabber-service'),
    TeamspeakService = require('../../services/applications/teamspeak/teamspeak-service')(),
    Character = require('mongoose').model('Character');


exports.setJabberUser = function(req, res, next) {

    var user = req.user;

    if(!user.services) user.services = { jabber: {} };
    if(!user.services.jabber) user.services.jabber = {};

    Character.findOne({ _id: req.body.character }, function(err, character){


        var name = character.name;
        name = name.replace(/ /g, '_');
        name = name.replace(/'/g, '_');
        name = name.toLowerCase();

        user.services.jabber.username = name;
        user.services.jabber.character = req.body.character;

        user.save(function(err) {
            if(err){
                next({ msg: err, tags: ['auth', 'jabber-admin']});
            }
            res.json({ message: 'Success' })
        });

    });


};

exports.resetJabberPassword = function(req, res, next) {

    var jUser = req.user.services.jabber;
    jUser.password = req.body.password;

    jabber.updateUser(jUser).then(function(){
        jabber.updateGroups(req.user);
    });
    res.send(200);

};

exports.setTeamspeakUid = function(req, res, next) {

    if(!req.body.uid) return res.status(400).json({ message: 'Missing UID' });

    TeamspeakService.setId(req.user._id, req.body.uid).then(function(user){
        return res.status(200).json({ info: user.services.teamspeak });
    }, function(err){
        console.log(err);
        return res.status(400).json({ message: 'Invalid UID' });
    });

};