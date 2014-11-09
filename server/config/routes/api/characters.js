var controller = require('../../../controllers/api/charactersController')();

module.exports = function(app) {
    app.get('/api/characters', controller.listByUser);
    app.put('/api/characters/primary/:characterId', controller.updatePrimaryCharacter)
};
