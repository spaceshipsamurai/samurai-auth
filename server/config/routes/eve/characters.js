var controller = require('../../../controllers/eve/charactersController')();

module.exports = function(app) {
    app.get('/api/characters', controller.listByUser);
    app.get('/api/characters/primary', controller.listPrimaries);
    app.put('/api/characters/primary/:characterId', controller.updatePrimaryCharacter)
};
