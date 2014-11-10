var controller = require('../../../controllers/api/recruitmentController');

module.exports = function(app) {
    app.get('/api/recruitment', controller.list);
    app.post('/api/recruitment/add', controller.add)
};
