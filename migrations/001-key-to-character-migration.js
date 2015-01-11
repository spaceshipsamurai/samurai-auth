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

var keySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId },
    keyId: { type: Number, required: 'Key Id is required', unique: 'Key Id is already in use'},
    vCode: String,
    accessMask: Number,
    keyType: String,
    expires: Date,
    lastCheck: Date,
    status: { type: String, enum: ['Valid', 'Expired', 'Error']},
    lastResponse: String,
    characters: [{
        _id: false,
        name: String,
        isPrimary: Boolean,
        corporation: {
            id: Number,
            name: String
        },
        alliance: {
            id: Number,
            name: String
        },
        id: Number
    }]
});

var Key = mongoose.model('Key', keySchema);
var Character = mongoose.model('Character');

db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    Key.find({}, function(err, keys){

        for(var x = 0; x < keys.length; x++)
        {
            var key = keys[x];

            for(var c = 0; c < key.characters.length; c++)
            {
                var old = key.characters[c].toObject();
                var character = new Character({
                    id: old.id,
                    name: old.name,
                    user: key.userId,
                    key: key._id,
                    alliance: {
                        id: old.alliance.id,
                        name: old.alliance.name
                    },
                    corporation: {
                        id: old.corporation.id,
                        name: old.corporation.name
                    }

                });

                character.save(function(err, char){
                    if(err) console.log(err);
                    else console.log('Saved: ' + char.name );
                })
            }
        }

    });

});
