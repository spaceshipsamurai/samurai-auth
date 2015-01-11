/**
 * Created by Russell on 12/31/2014.
 * This fixes existing jids that only had one space or "'" replaced as well as making
 * sure all keys have a valid status
 */


var config = require('../server/config/config').getConfig(),
    mongoose = require('mongoose');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

require('../server/models/account/User');
require('../server/models/eve/Character');
require('../server/models/eve/Key');

var User = mongoose.model('User');
var Character = mongoose.model('Character');
var Key = mongoose.model('Key');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');


    Key.find({ status: { $exists: false }}, function(err, keys){

        for(var x = 0; x < keys.length; x++) {
            keys[x].status = 'Valid';
            keys[x].save(function(err, key){
                if(err) console.log(err);
                else console.log('updated key: ' + key._id);
            });
        }

    });

    User.find({ 'services.jabber.username': { $exists: true }}, function(err, users){
        for(var x = 0; x < users.length; x++)
        {
            var name = users[x].services.jabber.username;
            name = name.replace(/ /g, '_');
            name = name.replace(/'/g, '_');
            name = name.toLowerCase();
            users[x].services.jabber.username = name;
            users[x].save(function(err){
                if(err) console.log(err);
                else console.log('updated: ' + name);
            })
        }
    })


});
