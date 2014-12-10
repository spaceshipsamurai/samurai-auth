var GroupManager = require('samurai-membership').Groups;

exports.applyToGroup = function(req, res, next) {

    GroupManager.apply(req.params.id, {
        userId: req.user._id,
        character: {
            id: Number(req.body.id),
            name: req.body.name
        }
    }).then(function(){
        res.json({ message: 'Success' })
    }).catch(function(err){
        next({ msg: err, tags: ['auth','groups']})
    });

};