var KeyManager = require('../../services/eve/key-service')(),
    CharacterService = require('../../services/eve/character-service')(),
    User = require('mongoose').model('User');

module.exports = function () {

    var list = function (req, res) {

        KeyManager.find({userId: req.user._id}).then(function (keys) {
            return res.json(keys);
        }, function (err) {
            return res.status(400).json({message: err});
        });
    };

    var create = function (req, res) {

        if (!req.body.keyId || !req.body.vCode)
            return res.status(400).json( { errors: ['Missing key id or verification code'] });

        KeyManager.fetch(req.body.keyId, req.body.vCode)
            .then(function (key) {

                var errors = KeyManager.validate(key);

                if(errors.length === 0)
                {
                    key.userId = req.user._id;

                    KeyManager.save(key).then(function (saved) {
                        return res.json(saved.toObject());
                    });
                }
                else {
                    return res.status(400).json({ errors: errors });
                }
            }, function(err) {

                if(err.message && err.message.indexOf('403') > -1)
                {
                    return res.status(400).json({ errors: ['Key is expired'] });
                }

                return res.status(400).json({ errors: [ err.message ] });

            });

    };

    var update = function(req, res, next) {

        if (!req.body.keyID || !req.body.vCode)
            return res.status(400).json({message: "Missing key id or verification code"});

        KeyManager.fetch(req.body.keyID, req.body.vCode)
            .then(function (key) {

                var errors = KeyManager.validate(key);

                if(errors.length === 0)
                {
                    key.userId = req.user._id;
                    key._id = req.params.id;

                    KeyManager.save(key).then(function (saved) {
                        return res.json(saved.toObject());
                    }).catch(function (err) {
                        return next({message: err.message, stack: err.stack });
                    });
                }
                else {
                    return res.status(400).json(errors);
                }
            });
    };

    var remove = function (req, res) {

        if (!req.params.keyId) return res.status(400).json({message: 'Error deleting key'});

        KeyManager.remove(req.params.keyId).then(function () {
            return res.json({message: 'Success'});
        }, function (err) {
            return res.status(400).json({message: 'Error deleting key'});
        });

    };

    return {
        list: list,
        create: create,
        remove: remove,
        update: update
    }
}();