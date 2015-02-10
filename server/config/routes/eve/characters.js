var controller = require('../../../controllers/eve/charactersController')();

module.exports = function(app) {
    app.get('/api/characters', controller.listByUser);
    app.get('/api/characters/primary', controller.listPrimaries);
    app.get('/api/characters/affiliated', controller.getAffiliated);
    app.put('/api/characters/primary/:cid', controller.updatePrimaryCharacter)
};
