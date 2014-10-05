var neow = require('neow'),
    Key = require('mongoose').model('Key'),
    User = require('mongoose').model('User');

module.exports = function() {

    var list = function(req, res) {

        Key.find({ userId: req.user._id }, function(err, keys) {

            if(keys)
            {
                return res.json(keys);
            }

        });
    };

    var create = function(req, res) {

        if(!req.body.keyID || !req.body.vCode)
            return res.status(400).json({ message: "Missing key id or verification code"});

        var eClient = new neow.EveClient({
            keyID: req.body.keyID,
            vCode: req.body.vCode
        });

        var newKey = new Key({
            keyId: req.body.keyID,
            vCode: req.body.vCode,
            userId: req.user._id
        });

        eClient.fetch('account:APIKeyInfo').then(function(result){

            newKey.accessMask = result.key.accessMask;
            newKey.type = result.key.type;
            newKey.expires = result.key.expires;
            newKey.characters = [];

            for(var cid in result.key.characters)
            {
                var character = result.key.characters[cid];

                newKey.characters.push({
                    name: character.characterName,
                    isPrimary: false,
                    corporation: {
                        id: character.corporationID,
                        name: character.corporationName
                    },
                    alliance: {
                        id: character.allianceID,
                        name: character.allianceName
                    },
                    id: character.characterID
                });
            }

            newKey.save(function(err){
                console.log(err);
                return res.send({ success: true });
            });

        });

    };

    var remove = function(req, res) {

        var isPrimary = false;

        Key.findOne({ keyId: req.params.keyId }, function(err, key) {

            if(err) {
                console.log(err);
                return res.status(400).json({ message: 'Error deleting key'});
            }

            if(!key) {
                return res.status(400).json({ message: 'Error deleting key'})
            }

            if(!key.userId.equals(req.user._id)) {
                return res.status(400).json({ message: 'Error deleting key'})
            }



            key.remove(function(rmErr){

                if(rmErr) {
                    console.log(rmErr);
                    return res.status(400).json({ message: 'Error deleting key'});
                }

                if(req.user.character) {

                    for(var x = 0; x < key.characters.length; x++) {
                        if(key.characters[x].id == req.user.character.id) {
                            console.log("TESTING");
                            User.update({ _id: req.user._id }, { $unset: { character: 1 }}, function(err) {
                                if(err) {
                                    console.log(err);
                                }
                            });
                        }
                    }

                }

                return res.json({ message: 'Success'});
            });

        });

    };

    return {
        list: list,
        create: create,
        remove: remove
    }
};