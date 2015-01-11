/**
 * Created by Russell on 12/31/2014.
 * This script migrates characters from Key objects
 * to character objects
 */


var config = require('../server/config/config').getConfig(),
    mongoose = require('mongoose');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

require('../server/models/eve/Character');
require('../server/models/eve/Key');


var Key = mongoose.model('Key');
var Character = mongoose.model('Character');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    Key.update({}, { $unset: { characters: 1 }}, function(err){

        if(err) console.log(err);
        else {

            Key.update({}, { $set: { characters: [] }}, function(err){
                if(err) console.log(err);
                else {

                    Key.find({}, function(err, keys){

                        if(err) console.log(err);
                        else {

                            for(var k = 0; k < keys.length; k++)
                            {
                                Character.find({ key: keys[k]._id })
                                    .populate('key')
                                    .exec(function(err, characters){

                                        var cids = [];

                                        for(var x = 0; x < characters.length; x++)
                                            cids.push(characters[x]._id);

                                        if(characters.length > 0)
                                        {
                                            characters[0].key.characters = cids;
                                            characters[0].key.save(function(err){
                                                if(err) console.log(err);
                                                else console.log('Updated ' + characters[0].key._id);
                                            })
                                        }

                                    });
                            }

                        }

                    });

                }
            });

        }

    });

});
