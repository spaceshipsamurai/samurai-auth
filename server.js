var express = require('express'),
    app = express(),
    config = require('./server/config/config').getConfig(),
    logger = require('./server/config/logger');


require('./server/config/mongoose')(config);
require('./server/config/express')(app, config);
require('./server/config/routes')(app);
require('./server/config/passport')();

process.on('uncaughtException', function(err){
    logger.critical({
        message: err.message,
        type: err.type,
        stack: err.stack
    }, ['uncaught']);
});

app.listen(config.port);
console.log('Server started listening on port ' + config.port);
