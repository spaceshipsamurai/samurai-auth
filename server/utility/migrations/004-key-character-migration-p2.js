/**
 * Created by Russell on 12/31/2014.
 * This script migrates characters from Key objects
 * to character objects
 */


var config = require('../../config/config').getConfig(),
    mongoose = require('mongoose');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

require('../../models/eve/Character');
require('../../models/eve/Key');


var Key = mongoose.model('Key');
var Character = mongoose.model('Character');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    Key.find({}, function(err, keys){

        for(var x = 0; x < keys.length; x++)
        {

            Character.find({ key: keys[x]._id })
                .populate('key')
                .exec(function(err, characters){

                    var clist = [];

                    for(var c = 0; c < characters.length; c++)
                    {
                        clist.push(characters[c]._id );
                    }

                    characters[0].key.characters = clist;
                    characters[0].key.save(function(err){
                        if(err) console.log(err);
                        else console.log('Fixed key-characters for ' + characters[0].key._id);
                    })

                });
        }

    });

});
