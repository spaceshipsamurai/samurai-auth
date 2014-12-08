var path = require('path');

module.exports = function(app, controllerDir) {

    var controller = require(path.join(controllerDir, 'api/groupAdminController'));

    app.get('/api/admin/groups', controller.list);
    app.get('/api/admin/groups/:id/members', controller.members);
    app.post('/api/admin/groups/:gid/members/:cid/approve', controller.approveMember);
};
