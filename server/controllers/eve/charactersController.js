var mongoose = require('mongoose'),
    KeyManager = require('../../services/eve/key-service'),
    User = mongoose.model('User'),
    Character = mongoose.model('Character');

module.exports = function() {

    var listByUser = function(req, res) {
        KeyManager.getCharacters({ userId: req.user._id }).then(function(characters){
            return res.json(characters);
        }).catch(function(err){
            return res.status(400).json({ message: err });
        });
    };

    var listPrimaries = function(req, res, next) {

        User.find({}, 'primary')
            .populate('primary')
            .exec(function(err, docs){
                if(err) return next({ msg: err, tags: ['characters', 'listPrimaries', 'mongo']});

                User.populate(docs, { path: 'primary.key', model: 'Key'}, function(err, users){

                    var filtered = users.filter(function(user){
                        return user.primary && user.primary.key && user.primary.key.status === 'Valid';
                    });

                    return res.json(filtered);
                });
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
        updatePrimaryCharacter: updatePrimaryCharacter,
        listPrimaries: listPrimaries
    }

};
