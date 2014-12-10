var path = require('path');

module.exports = function(app, controllerDir) {

    var controller = require(path.join(controllerDir, 'api/groupsController'));
    app.post('/api/groups/:id/apply', controller.applyToGroup);
};
