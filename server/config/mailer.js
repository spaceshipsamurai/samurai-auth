var config = require('./config').getConfig(),
    logger = require('./logger');

var mailer;

if(config.sendgrid.sendMail) {
    mailer = require('sendgrid')(config.sendgrid.api_user, config.sendgrid.api_key);
}

exports.send = function(mail, cb) {

    if(config.sendgrid.sendMail) {
        mailer.send(mail, function(err, info) {

            if(err) {
                logger.critical(err, ['mailer']);
            }

            if(typeof cb === 'function')
                cb(err, info);
        });
    }
    else {
        console.log(mail);

        if(typeof cb === 'function')
            cb('', {});

    }
};

