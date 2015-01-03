/**
 * Created by Russell on 12/31/2014.
 * This script will migrate "Primary Character" selections
 * to the new primary property. This change is to accommodate
 * future services such as TS and Jabber.
 */


var config = require('../../config/config').getConfig(),
    mongoose = require('mongoose');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

require('../../models/account/User');
require('../../models/eve/Character');

var User = mongoose.model('User');
var Character = mongoose.model('Character');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    User.find({}, function(err, users){

        for(var x = 0; x < users.length; x++) {

            var user = users[x].toObject();

            if(!user.character) continue;

            var id = user.character.id;

            Character.findOne({ user: users[x]._id, id: id })
                .populate('user')
                .exec(function(err, character){

                    if(err) {
                        console.log(err);
                        return;
                    }

                    if(character) {
                        character.user.primary = character._id;
                        character.user.save(function(err){
                            if(err) console.log(err);
                            else console.log('Updated: ' + character.user.email);
                        });
                    }

                });
        }

    });

});
