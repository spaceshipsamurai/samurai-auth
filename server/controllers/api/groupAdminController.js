var groupManager = require('samurai-membership').Groups


exports.list = function(req, res, next) {
    groupManager.getAllGroups().then(function(groups){
        res.json(groups);
    }).catch(function(err){
        next({ msg: err, tags: ['auth', 'group-admin']})
    });
};

exports.members = function(req, res, next) {

    groupManager.getMembersByGroup(req.params.id).then(function(members){

        var characters = members.reduce(function(prev, curr){

            for(var x = 0; x < curr.characters.length; x++ ) {
                var char = curr.characters[x].toObject();
                char.userId = curr.userId;
                prev = prev.concat(char);
            }

            return prev;

        }, []);

        res.json(characters);

    }).catch(function(err){
        next({ msg: err, tags: ['auth', 'group-admin']})
    });
};

exports.approveMember = function(req, res, next) {

    groupManager.acceptMember({
        groupId: req.params.gid,
        approvedBy: req.user._id,
        characterId: req.params.cid
    }).then(function(){
        res.json({ message: 'Success' })
    }).catch(function(err){
        next({ msg: err, tags: ['auth', 'group-admin']});
    });

};
