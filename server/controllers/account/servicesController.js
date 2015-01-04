var jabber = require('../../services/jabber-service'),
    Character = require('mongoose').model('Character');

exports.setForumUser = function(req, res, next) {

    var user = req.user;

    if(!user.services) user.services = { forum: {} };
    if(!user.services.forum) user.services.forum = {};

    var name = req.body.cname;
    var id = Number(req.body.cid);

    user.services.forum.name = name;
    user.services.forum.characterId = id;

    user.save(function(err) {
        if(err){
            next({ msg: err, tags: ['auth', 'group-admin']});
        }
        res.json({ message: 'Success' })
    });
};

exports.setJabberUser = function(req, res, next) {

    var user = req.user;

    if(!user.services) user.services = { jabber: {} };
    if(!user.services.jabber) user.services.jabber = {};

    Character.findOne({ _id: req.body.character }, function(err, character){


        var name = character.name;
        name = name.replace(' ', '_');
        name = name.replace('\'', '_');
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