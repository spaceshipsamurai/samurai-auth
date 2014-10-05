var Key = require('mongoose').model('Key'),
    controller = require('../../../controllers/api/keysController')(Key);

module.exports = function(app, authCookie) {
    app.get('/api/keys', authCookie, controller.list);
    app.post('/api/keys', authCookie, controller.create)
    app.delete('/api/keys/:keyId', authCookie, controller.remove);
};
