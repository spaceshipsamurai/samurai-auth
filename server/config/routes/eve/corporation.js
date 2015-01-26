var path = require('path');

module.exports = function(app, controllerDir) {

    var controller = require(path.join(controllerDir, 'eve/corporation-controller'));

    app.get('/api/corporations', controller.can('view.admin'), controller.list);

};
