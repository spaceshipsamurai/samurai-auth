var path = require('path');

module.exports = function(app, controllerDir) {

    var controller = require(path.join(controllerDir, 'eve/alliance-controller'));

    app.get('/api/alliances', controller.can('view.admin'), controller.list);
    app.get('/api/alliances/affiliated', controller.can('view.admin'), controller.listAffiliated);
    app.get('/api/alliances/:id', controller.get);
    app.put('/api/alliances/:id', controller.can('edit'), controller.update);
    app.get('/cron/alliance/sync', controller.can('sync'), controller.sync);

};
