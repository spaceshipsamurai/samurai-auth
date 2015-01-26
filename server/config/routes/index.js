var config = require('./../config').getConfig(),
    path = require('path');


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    return res.status(401).send();
};

var controllerDir = path.join(config.rootPath, 'server/controllers');

module.exports = function(app) {

    app.get('/templates/*', function(req, res) {
        return res.render( req.params[0]);
    });

    app.all('/api/*', ensureAuthenticated);
    require('./account/account')(app);
    require('./account/session')(app);
    require('./account/services')(app, controllerDir);
    require('./account/groups')(app, controllerDir);
    require('./eve/keys')(app, controllerDir);
    require('./eve/characters')(app, controllerDir);
    require('./eve/corporation')(app, controllerDir);
    require('./eve/alliance')(app, controllerDir);
    require('./recruitment/recruitment')(app, controllerDir);


    app.get('*',function(req, res, next) {
        if(!req.isAuthenticated())
            return res.redirect('/login');

        return next();
    }, function(req, res) {
        return res.render('shared/admin_layout')
    });

};