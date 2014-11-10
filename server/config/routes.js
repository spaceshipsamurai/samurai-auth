var config = require('./config').getConfig();

module.exports = function(app) {

    app.get('/templates/*', function(req, res) {
        return res.render( req.params[0]);
    });

    require('./routes/account')(app);

    var ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        return res.status(401).send();
    };

    app.all('/api/*', ensureAuthenticated);

    require('./routes/session')(app);
    require('./routes/api/keys')(app);
    require('./routes/api/characters')(app);
    require('./routes/api/recruitment')(app);

    app.get('*',function(req, res, next) {
        if(!req.isAuthenticated())
            return res.redirect('/login');

        return next();
    }, function(req, res) {
        return res.render('shared/admin_layout')
    });

};
