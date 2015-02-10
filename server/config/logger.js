var loggly = require('loggly'),
    config = require('./config').getConfig();

module.exports = function() {
    var client = loggly.createClient(config.loggly);

    var info = function(msg, tags) {
        log('info', msg, tags);
    };

    var warning = function(msg, tags) {
        log('warning', msg, tags);
    };

    var error = function(msg, tags) {
        log('error', msg, tags);
    };

    var critical = function(msg, tags) {
        log('critical', msg, tags);
    };

    var log = function(level, msg, tags) {
        if(!tags || !(tags instanceof Array)) tags = [];

        tags.push(level);

        if(config.loggly.local)
        {
            console.log(tags);
            console.log(msg);
        }
        else {
            client.log(msg, tags);
        }
    };

    return {
        info: info,
        warning: warning,
        error: error,
        critical: critical
    }

}();
