var controller = require('../../../controllers/api/charactersController')();

module.exports = function(app, authCookie) {
    app.get('/api/characters', authCookie, controller.listByUser);
    app.put('/api/characters/primary/:characterId', controller.updatePrimaryCharacter)
};
