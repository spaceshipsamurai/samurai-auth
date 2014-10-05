var User = require('mongoose').model('User'),
    accountController = require('../../controllers/AccountController')(User);

module.exports = function(app) {
    app.get('/login', accountController.showLogin);
    app.get('/register', accountController.showLogin);
    app.post('/account/register', accountController.registerUser);
    app.get('/account/activate/:id', accountController.activate);
    app.get('/account/password/forgot', accountController.getForgotPassword);
    app.post('/account/password/forgot', accountController.postForgotPassword);
    app.get('/account/password/reset/:id', accountController.getPasswordReset);
    app.post('/account/password/reset', accountController.postPasswordReset);
};

