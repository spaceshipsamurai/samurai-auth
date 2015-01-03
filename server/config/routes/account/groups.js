var path = require('path');

module.exports = function(app, controllerDir) {

    var groups = require(path.join(controllerDir, 'account/groups-controller'));
    var membership = require(path.join(controllerDir, 'account/membership-controller'));

    //membership routes
    app.post('/api/groups/:id/apply', membership.applyToGroup);

    //group routes
    app.get('/api/groups', groups.get);
    app.post('/api/groups', groups.create);
    app.put('/api/groups/:gid', groups.update);
    app.delete('/api/groups/:gid', groups.delete);

};
