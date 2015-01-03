var path = require('path');

module.exports = function(app, controllerDir) {

    var controller = require(path.join(controllerDir, 'api/services/forumController'));

    app.post('/api/services/forum/user', controller.setForumUser);
};
