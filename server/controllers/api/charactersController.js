var mongoose = require('mongoose'),
    Key = mongoose.model('Key'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId;

module.exports = function() {

    var listByUser = function(req, res) {

        var characters = [];
        var userId = req.user._id;

        Key.find({ userId: userId }, function(err, keys){

            for(var x = 0; x < keys.length; x++) {
                var key = keys[x];

                for(var i = 0; i < key.characters.length; i++) {
                    characters.push(key.characters[i]);
                }
            }

            return res.json(characters);
        });

    };

    var updatePrimaryCharacter = function(req, res) {

        var userId = req.user._id;

        Key.find({ userId: userId }, function(err, keys){

            for(var x = 0; x < keys.length; x++) {
                var key = keys[x];

                for(var i = 0; i < key.characters.length; i++) {
                    if(key.characters[i].id == req.params.characterId ){
                        User.update({ _id: req.user._id }, { $set: { character: key.characters[i].toObject()}}, function(){
                            console.log('Updated');

                            return res.json();
                        });
                    }
                }
            }


        });

    };

    return {
        listByUser: listByUser,
        updatePrimaryCharacter: updatePrimaryCharacter
    }

};
