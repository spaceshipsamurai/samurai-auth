var path = require('path');

module.exports = function(app, controllerDir) {

    var controller = require(path.join(controllerDir, 'account/servicesController'));

    app.post('/api/services/forum/user', controller.setForumUser);
    app.post('/api/services/jabber/user', controller.setJabberUser);
    app.put('/api/services/jabber/user/password', controller.resetJabberPassword);
};
