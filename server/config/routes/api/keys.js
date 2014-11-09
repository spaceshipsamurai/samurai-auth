var Key = require('mongoose').model('Key'),
    controller = require('../../../controllers/api/keysController')(Key);

module.exports = function(app) {
    app.get('/api/keys', controller.list);
    app.post('/api/keys', controller.create)
    app.delete('/api/keys/:keyId', controller.remove);
};
