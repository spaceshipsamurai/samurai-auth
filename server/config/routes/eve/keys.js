var controller = require('../../../controllers/eve/keys-controller');

module.exports = function(app) {
    app.get('/api/keys', controller.list);
    app.post('/api/keys', controller.create);
    app.put('/api/keys/sync', controller.sync);
    app.put('/api/keys/:id', controller.update);
    app.delete('/api/keys/:keyId', controller.remove);
};
