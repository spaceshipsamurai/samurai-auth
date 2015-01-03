var KeyManager = require('../../services/eve/key-service'),
    User = require('mongoose').model('User');

module.exports = function() {

    var list = function(req, res) {

        KeyManager.getByUserId(req.user._id).then(function(keys){
            return res.json(keys);
        }, function(err){
            return res.status(400).json({ message: err });
        });
    };

    var create = function(req, res) {

        if(!req.body.keyID || !req.body.vCode)
            return res.status(400).json({ message: "Missing key id or verification code"});

        KeyManager.create({
            id: req.body.keyID,
            vCode: req.body.vCode,
            userId: req.user._id
        }).then(function(key){
            console.log('success');
            return res.json(key.toObject);
        }, function(err){
            console.log('error');
            return res.status(400).json({ message: err });
        });

    };

    var remove = function(req, res) {

        if(!req.params.keyId) return res.status(400).json({ message: 'Error deleting key'});

        KeyManager.remove(req.params.keyId).then(function(){
            return res.json({ message: 'Success'});
        }, function(err){
            return res.status(400).json({ message: 'Error deleting key'});
        });

    };

    return {
        list: list,
        create: create,
        remove: remove
    }
}();