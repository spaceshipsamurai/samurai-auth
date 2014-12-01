var controller = require('../../../controllers/api/keysController');

module.exports = function(app) {
    app.get('/api/keys', controller.list);
    app.post('/api/keys', controller.create)
    app.delete('/api/keys/:keyId', controller.remove);
};
