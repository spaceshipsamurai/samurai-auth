var corpService = require('../../services/eve/corporation-service')();

var permissions = {
    "view.admin": {
        groups: ['Admins']
    }
};

module.exports = function() {

    var list = function(req, res, next) {

        corpService.find({}).then(function(corps){
            return res.json(corps);
        }).catch(function(err){
            return next(err);
        })

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

            return res.send(403);
        };

    };

    return {
        list: list,
        can: can
    }
}();
