var path = require('path');

module.exports = function(app, controllerDir) {

    var groups = require(path.join(controllerDir, 'account/groups-controller'));
    var membership = require(path.join(controllerDir, 'account/membership-controller'));

    //membership routes
    app.post('/api/groups/:id/apply', membership.applyToGroup);
    app.get('/api/groups/:gid/members', membership.can('view'), membership.get);
    app.post('/api/groups/:gid/members/:uid/approve', membership.can('edit'), membership.approve);
    app.delete('/api/groups/:gid/members/:uid', membership.can('edit'), membership.remove);

    //group routes
    app.get('/api/groups', groups.get);
    app.post('/api/groups', groups.can('edit'), groups.create);
    app.put('/api/groups/:gid', groups.can('edit'), groups.update);
    app.delete('/api/groups/:gid', groups.can('edit'), groups.remove);

};
