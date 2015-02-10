var mongoose = require('mongoose'),
    KeyManager = require('../../services/eve/key-service'),
    CharacterService = require('../../services/eve/character-service')(),
    User = mongoose.model('User'),
    Character = mongoose.model('Character'),
    async = require('async');

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

    var updatePrimaryCharacter = function(req, res, next) {

        Character.findOne({ _id: req.params.cid, user: req.user._id })
            .populate('user', 'primary')
            .exec(function(err, character){
                if(err) return next({ msg: err, tags: ['characters', 'auth', 'mongo', 'update-primary']});

                if(!character) return res.json({ msg: 'success' });


                character.user.primary = req.params.cid;
                character.user.save(function(err){
                    if(err) return next({ msg: err, tags: ['characters', 'auth', 'mongo', 'update-primary']});
                    return res.json({ msg: 'success' })
                });
            });


    };

    var getAffiliated = function(req, res, next) {

        CharacterService.find({ user: req.user._id }).then(function(characters){

            async.filter(characters, function(character, cb){

                CharacterService.getAffiliation(character._id).then(function(aff){
                    cb(aff === 'Alliance' || aff === 'Coalition');
                }).catch(function(err) {
                    return next(err);
                });

            }, function(results){
                return res.json(results);
            });

        }, function(err) {
            return next(err);
        });

    };

    return {
        listByUser: listByUser,
        updatePrimaryCharacter: updatePrimaryCharacter,
        listPrimaries: listPrimaries,
        getAffiliated: getAffiliated
    }

};
