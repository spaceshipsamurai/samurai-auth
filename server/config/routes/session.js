var sessionController = require('../../controllers/SessionController');

module.exports = function(app) {

    app.post('/session', sessionController.authenticate);
    app.get('/session', sessionController.getCurrentUser);
    app.delete('/session', sessionController.logout);

}
