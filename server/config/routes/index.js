var config = require('./../config').getConfig(),
    path = require('path');

module.exports = function(app) {

    app.get('/templates/*', function(req, res) {
        return res.render( req.params[0]);
    });

    require('./account')(app);
    require('./session')(app);

    var ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        return res.status(401).send();
    };

    app.all('/api/*', ensureAuthenticated);

    var fs = require('fs');
    var normalizedPath = path.join(__dirname, 'api');
    var controllerDir = path.join(config.rootPath, 'server/controllers');

    fs.readdirSync(normalizedPath).forEach(function(file){
        if(file.match(/.+\.js/g) !== null)
            require('./api/' + file)(app, controllerDir);
    });

    normalizedPath = path.join(__dirname, 'api/admin');
    fs.readdirSync(normalizedPath).forEach(function(file){
        require('./api/admin/' + file)(app, controllerDir);
    });

    app.get('*',function(req, res, next) {
        if(!req.isAuthenticated())
            return res.redirect('/login');

        return next();
    }, function(req, res) {
        return res.render('shared/admin_layout')
    });

};