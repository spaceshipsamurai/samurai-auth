var allianceService = require('../../services/eve/alliance-service')();

var permissions = {
    "view.admin": {
        groups: ['Admins']
    },
    'edit': {
        groups: ['Admins']
    },
    'sync': {
        localOnly: true
    }
};

module.exports = function() {

    var list = function(req, res, next) {

        allianceService.find({}, 'id name').then(function(corps){
            return res.json(corps);
        }).catch(function(err){
            return next(err);
        })

    };

    var listAffiliated = function(req, res, next) {

        allianceService.find({ $or: [ { isPrimary: true }, { coalitionMember: true}]}).then(function(corps){
            return res.json(corps);
        }).catch(function(err){
            return next(err);
        })

    };

    var get = function(req, res, next) {

        var id = Number(req.params.id);

        allianceService.findOne({ id: id }).then(function(alliance){
            return res.json(alliance);
        }).catch(function(err){
            return next(err);
        });

    };

    var update = function(req, res, next) {

        req.body.id = req.params.id;

        allianceService.update(req.body).then(function(alliance){
            return res.json(alliance);
        }).catch(function(err){
            return next(err);
        });

    };

    var sync = function(req, res, next) {
        allianceService.sync().then(function(){
           res.json({ message: 'success'})
        }).catch(next);
    };

    var can = function(action) {

        return function(req, res, next) {

            if(permissions[action] && permissions[action].groups)
            {
                var matches = permissions[action].groups.filter(function(group){
                    return req.user.groups[group] !== undefined;
                });

                if(matches.length > 0)
                    return next();
            }

            if(permissions[action] && permissions[action].localOnly) {
                if(req.host === 'localhost') return next();
            }

            return res.send(403);
        };

    };

    return {
        list: list,
        listAffiliated: listAffiliated,
        get: get,
        update: update,
        can: can,
        sync: sync
    }
}();
