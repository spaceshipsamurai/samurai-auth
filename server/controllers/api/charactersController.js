var mongoose = require('mongoose'),
    KeyManager = require('samurai-membership').Keys,
    User = mongoose.model('User')

module.exports = function() {

    var listByUser = function(req, res) {
        KeyManager.getCharacters({ userId: req.user._id }).then(function(characters){
            return res.json(characters);
        }).catch(function(err){
            return res.status(400).json({ message: err });
        });
    };

    var updatePrimaryCharacter = function(req, res) {

        var userId = req.user._id;

        KeyManager.getCharacters({userId: req.user._id }).then(function(characters){

            if(characters[req.params.characterId]){
                User.update({ _id: req.user._id }, { $set: { character: characters[req.params.characterId]}}, function(){
                    return res.json();
                });
            }
            else{
                return res.json();
            }

        }).catch(function(err){
            return res.status(400).json({ message: err });
        });

        Key.find({ userId: userId }, function(err, keys){

            for(var x = 0; x < keys.length; x++) {
                var key = keys[x];

                for(var i = 0; i < key.characters.length; i++) {
                    if(key.characters[i].id == req.params.characterId ){
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
