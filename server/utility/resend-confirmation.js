var config = require('../config/config').getConfig(),
    mongoose = require('mongoose'),
    jade = require('jade'),
    path = require('path');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

require('../models/User');
var User = mongoose.model('User');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open...');

    mailer = require('sendgrid')(config.sendgrid.api_user, config.sendgrid.api_key);

    User.find({}, function(err, users){

        for(var index = 0; index < users.length; index++)
        {
            if(users[index].confirmationId)
            {
                console.log('RESENDING:' + users[index].email);

                jade.renderFile(path.join(config.rootPath, 'server/views/emails/confirmation.jade'), { confirmation_link: 'http://auth.spaceshipsamurai.com/account/activate/' + users[index].confirmationId }, function(err, text) {

                    if(err) {
                        console.log(err);
                    }
                    else {

                        mailer.send({
                            from: 'noreply@spaceshipsamurai.com',
                            fromname: 'Spaceship Samurai',
                            to: users[index].email,
                            subject: 'Account Confirmation',
                            text: text
                        }, function(err){
                            console.log(err);
                        });
                    }

                });

            }
        }

        mongoose.connection.close()

    });

});



