var config = require('./config').getConfig();

module.exports = function(app) {


    app.get('/', function(req, res){
        console.log('home');
        return res.json({ message: 'success' });
    });

    //for authentication
    var authFunction = function(req, res, next) {

        if(!req.isAuthenticated())
            return res.redirect('/login');
        else
        {
            var currentUser = req.user.toObject();

            var user = {
                email: currentUser.email,
                character: currentUser.character
            };

            res.cookie('ag-user', JSON.stringify(user));
        }

        next();
    };

    app.get('/templates/*', function(req, res) {
        return res.render( req.params[0]);
    });

    require('./routes/account')(app);
    require('./routes/session')(app);
    require('./routes/api/keys')(app, authFunction);
    require('./routes/api/characters')(app, authFunction);

    app.get('/api/user', function(req, res){

        var currentUser = req.user.toObject();

        var user = {
            email: currentUser.email,
            character: currentUser.character
        };

        return res.json(user);
    });

    app.get('*', authFunction, function(req, res) {
        return res.render('shared/admin_layout')
    });

};
