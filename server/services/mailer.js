var nodemailer = require('nodemailer'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    config = require('../config/config').getConfig();

var mailer = function() {

    var options = {
        auth: {
            api_user: config.sendgrid.api_user,
            api_key: config.sendgrid.api_key
        }
    };

    var client = nodemailer.createTransport(sgTransport(options));

    var sendMail = function(mail, cb) {

        client.sendMail(mail, cb);

    };

    return {
        send: sendMail
    }

};

module.exports = mailer;

