var express = require('express'),
    app = express(),
    config = require('./server/config/config').getConfig();


require('./server/config/mongoose')(config);
require('./server/config/express')(app, config);
require('./server/config/routes')(app);
require('./server/config/passport')();

app.listen(config.port);
console.log('Server started listening on port ' + config.port);
