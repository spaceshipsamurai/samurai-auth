

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