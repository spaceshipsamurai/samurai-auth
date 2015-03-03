var path = require('path');

module.exports = function(app, controllerDir) {

    var profiles = require(path.join(controllerDir, 'account/profiles-controller'));

    //membership routes
    app.get('/api/profile/rebuild', profiles.rebuildProfile);


};
