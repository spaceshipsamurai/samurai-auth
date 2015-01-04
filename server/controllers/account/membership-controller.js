var Membership = require('../../services/account/membership-service'),
    mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    Group = mongoose.model('Group');

var permissions = {
    "view": {
        groups: ['Admins']
    },
    "edit": {
        groups: ['Admins']
    }
};

exports.applyToGroup  = function(req, res, next) {

    Membership.apply(req.params.id, req.user._id).then(function(){
        res.json({ message: 'Success' })
    }).catch(function(err){
        next({ msg: err, tags: ['auth','groups', 'apply']})
    });

};

exports.get = function(req, res, next) {

    Member.find({ group: req.params.gid })
        .populate('user', 'primary')
        .exec(function(err, docs){

            Member.populate(docs, { path: 'user.primary', model: 'Character'}, function(err, memberships){
                res.json(memberships);
            });

        });

};

exports.approve = function(req, res, next) {

    Member.findOne({ group: req.params.gid, user: req.params.uid }, function(err, member){

        if(err) return next({ msg: err, tags: ['membership', 'approve', 'mongo', 'auth']});

        member.approvedBy = req.user._id;
        member.approvedDate = new Date();
        member.status = "Active";
        member.save(function(err, saved) {
            if(err) return next({ msg: err, tags: ['membership', 'approve', 'mongo', 'auth']});
            return res.json(saved);
        });
    });

};

exports.remove = function(req, res, next) {

    Member.findOne({ group: req.params.gid, user: req.params.uid }, function(err, member){

        if(err) return next({ msg: err, tags: ['membership', 'approve', 'mongo', 'auth']});

        member.remove(function(err){
            if(err) return next({ msg: err, tags: ['membership', 'approve', 'mongo', 'auth']});
            return res.json({ msg: 'success' });
        })
    });

};

exports.can = function(action) {

    return function(req, res, next) {

        if(permissions[action] && permissions[action].groups)
        {
            var matches = permissions[action].groups.filter(function(group){
                return req.user.groups[group] !== undefined;
            });

            Group.findOne({
                _id: req.params.gid,
                $or: [{ owner: req.user._id }, { managers: req.user._id }]
            }, function(err, group){

                if(group) matches.push('Owner or Manager');

                if(matches.length > 0)
                    return next();

                return res.send(403);
            });


        }


    };
};