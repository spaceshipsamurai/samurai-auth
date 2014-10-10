var loggly = require('loggly'),
    config = require('../config/config');

var client = undefined;

if(config.getEnvironment() === 'production') {
    client = loggly.createClient(config.getConfig().loggly);
}

exports.log = function(level, msg, tags) {

    if(client) {
        client.log({
            level: level,
            message: msg,
            tags: tags
        });
    }
    else {
        console.log(level.toUpperCase() + ': ' + msg);
    }
};

exports.level = {
    info: "info",
    warn: "warning",
    critical: "critical"
};
