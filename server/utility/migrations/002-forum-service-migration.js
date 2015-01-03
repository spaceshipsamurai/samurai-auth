/**
 * Created by Russell on 12/31/2014.
 * This script will migrate "Primary Character" selections
 * to the new services.forum property. This change is to accomodate
 * future services such as TS and Jabber.
 */


var config = require('../../config/config').getConfig(),
    mongoose = require('mongoose');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

require('../../models/account/User');
var User = mongoose.model('User');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    User.find({}, function(err, users){

        for(var x = 0; x < users.length; x++) {

            var user = users[x].toObject();

            if(user.character)
            {
                users[x].services = {
                    forum: {
                        characterId: user.character.id,
                        name: user.character.name
                    }
                };

                users[x].save(function(err, user){
                    if(err) console.log(err);
                    else console.log('Migrated services for ' + user.email);
                });
            }

        }

    });

});
