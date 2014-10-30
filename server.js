var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log('ENV: ' + env);
var app = express();
var config = require('./server/config/config')[env];

require('./server/config/mongoose')(config);
require('./server/config/express')(app, config);
require('./server/config/routes')(app);
require('./server/config/passport')();

exports.app = app;

if(env != 'testing')
{
    app.listen(config.port);
    console.log('Server started listening on port ' + config.port);
}
