var controller = require('../../../controllers/api/recruitmentController');

module.exports = function(app) {
    app.get('/api/recruitment', controller.authorize, controller.list);
    app.post('/api/recruitment/add', controller.authorize, controller.add);
    app.post('/api/recruitment/mail', controller.authorize, controller.sendMail);
};
