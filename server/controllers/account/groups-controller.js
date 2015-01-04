var Group = require('mongoose').model('Group'),
    Member = require('mongoose').model('Member');

var permissions = {
    "edit": {
        groups: ['Admins']
    }
};

exports.get = function(req, res, next) {

    Group.find({})
        .populate('owner', 'primary')
        .populate('managers', 'primary')
        .exec(function(err, docs){

            if(err) return next({msg: err });

            Group.populate(docs, { path: 'owner.primary', model: 'Character' }, function(err, docs1){
                Group.populate(docs1, { path: 'managers.primary', model: 'Character' }, function(err, groups){
                    return res.json(groups);
                })
            });
        });

};

exports.create = function(req, res, next) {

    var name = req.body.name;
    var desc = req.body.description;
    var owner = req.body.owner;
    var managers = req.body.managers || [];
    var fGroup = req.body.forum;
    var tsGroup = req.body.teamspeak;
    var jGroup = req.body.jabber;

    if(fGroup) fGroup = Number(fGroup);
    if(tsGroup) tsGroup = Number(tsGroup);

    var group = new Group({
        name: name,
        description: desc,
        isPrivate: false,
        createdDate: new Date(),
        createdBy: req.user._id,
        owner: owner,
        managers: managers,
        forumGroupId: fGroup,
        teamspeakId: tsGroup,
        jabberId: jGroup
    });

    group.save(function(err, g) {

         if(err)
            return next({ msg: err, tags: ['groups', 'create', 'mongo']})

        if(owner) {

            var member = new Member({
                group: g._id,
                user: owner,
                status: 'Active',
                approvedDate: new Date(),
                approvedBy: req.user._id,
                owner: true,
                manager: managers.indexOf(owner) > 0
            });

            member.save();
        }

        for(var x = 0; x < managers.length; x++)
        {
            if(managers[x] === owner ) continue;
            else {

                var member = new Member({
                    group: g._id,
                    user: owner,
                    status: 'Active',
                    approvedDate: new Date(),
                    approvedBy: req.user._id,
                    owner: false,
                    manager: true
                });

                member.save();
            }
        }

        res.json(g);
     });



};

exports.update = function(req, res, next) {

};

exports.remove = function(req, res, next) {

    Group.findOne({ _id: req.params.gid }, function(err, group){

        if(err) return next({ msg: err, tags: ['groups', 'delete', 'mongo']});

        group.remove(function(err){

            if(err) return next({ msg: err, tags: ['groups', 'delete', 'mongo']});

            res.json({ msg: 'success' })
        });
    });

};

exports.can = function(action) {

    return function(req, res, next) {

        if(permissions[action] && permissions[action].groups)
        {
            var matches = permissions[action].groups.filter(function(group){
                return req.user.groups[group] !== undefined;
            });

            if(matches.length > 0)
                return next();
        }

        return res.send(403);
    };
};
