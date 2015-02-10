var neow = require('neow'),
    mongoose = require('mongoose'),
    Key = mongoose.model('Key'),
    Character = mongoose.model('Character'),
    Promise = require('bluebird'),
    async = require('async'),
    accountService = require('../account/account-service')();

module.exports = function () {

    var find = function (options, fields) {

        var query = Key.find(options).populate('characters');

        if (fields)
            query = query.select(fields);

        return query.exec();

    };

    var findOne = function (options, fields) {

        var query = Key.findOne(options).populate('characters');

        if (fields)
            query = query.select(fields);

        return query.exec();

    };

    var fetchKey = function (keyId, vCode) {

        var client = new neow.EveClient({
            keyID: keyId,
            vCode: vCode
        });

        return new Promise(function (resolve, reject) {

            client.fetch('account:APIKeyInfo')
                .then(function (result) {

                    var data = result.key;
                    var key = {
                        keyId: keyId,
                        vCode: vCode
                    };

                    key.accessMask = data.accessMask;
                    key.keyType = data.type;
                    key.expires = data.expires;
                    key.lastCheck = new Date();

                    var chars = [];

                    for (var id in data.characters)
                    {
                        var c = data.characters[id];
                        var char = {
                            id: c.characterID,
                            name: c.characterName,
                            corporation: {
                                id: c.corporationID,
                                name: c.corporationName
                            }
                        };

                        if(c.allianceID !== 0)
                        {
                            char.alliance = {
                                id: c.allianceID,
                                name: c.allianceName
                            }
                        }

                        chars.push(char);
                    }


                    key.characters = chars;

                    return resolve(key);

                }).catch(function (error) {
                    return reject(error);
                });

        });

    };

    var validate = function (key) {
        var keyModel = new Key(key);
        return keyModel.verify();
    };


    var save = function(keyData) {

        var oldStatus;

        return new Promise(function(resolve, reject){

            async.seq(function(data, cb){

                if(keyData._id)
                {
                    Key.findOne({ _id: keyData._id })
                        .populate('characters')
                        .exec(function(err, existing){

                            if(err) return cb(err, null);

                            existing.keyId = keyData.keyId;
                            existing.vCode = keyData.vCode;

                            return cb(null, existing);

                    });
                }
                else {
                    return cb(null, new Key({
                                keyId: keyData.keyId,
                                vCode: keyData.vCode,
                                userId: keyData.userId
                            }));
                }

            }, function(existing, cb){

                if(!existing) return cb();

                oldStatus = existing.status;

                existing.accessMask = keyData.accessMask;
                existing.status = 'Valid';
                existing.validationErrors = [];
                existing.keyType = keyData.keyType;
                existing.expires = keyData.expires;

                existing.save(function(err, saved){
                    if(err) return reject(err);

                    if(!saved.characters) saved.characters = [];

                    var existingCharacters = arrayToHash(saved.characters, 'id');
                    var newCharacters = arrayToHash(keyData.characters, 'id');
                    var promises = [];

                    for(var x = 0; x < saved.characters.length; x++)
                    {
                        var eChar = saved.characters[x];
                        var nChar = newCharacters[eChar.id];

                        if(nChar)
                        {
                            eChar.corporation.id = nChar.corporation.id;
                            eChar.corporation.name = nChar.corporation.name;

                            if(nChar.alliance)
                            {
                                eChar.alliance = {
                                    id: nChar.alliance.id,
                                    name: nChar.alliance.name
                                }
                            }

                            promises.push(eChar.save());
                        }
                        else {
                            saved.characters.splice(x, 1);
                            promises.push(Character.findByIdAndRemove(eChar._id).exec());
                        }

                    }

                    for(var x = 0; x < keyData.characters.length; x++)
                    {
                        var nChar = keyData.characters[x];
                        var eChar = existingCharacters[nChar.id];

                        if(!eChar)
                        {
                            eChar = {
                                id: nChar.id,
                                name: nChar.name,
                                corporation: {
                                    id: nChar.corporation.id,
                                    name: nChar.corporation.name
                                },
                                user: keyData.userId,
                                key: saved._id
                            };

                            if(nChar.alliance)
                            {
                                eChar.alliance = {
                                    id: nChar.alliance.id,
                                    name: nChar.alliance.name
                                }
                            }

                            var newCharacter = new Character(eChar);
                            promises.push(newCharacter.save());
                            saved.characters.push(newCharacter._id);
                        }

                    }

                    Promise.all(promises).then(function(){
                        saved.save(function(err, saved2){
                            if(err) return cb(err);
                            return cb(null, saved2);
                        });
                    });

                });

            })(null, function(err, savedKey){

                if(err) return reject(err);

                if(oldStatus === 'Invalid' && savedKey.status === 'Valid')
                {
                    accountService.activate(savedKey.userId);
                }

                return resolve(savedKey);
            });

        });
    };

    var arrayToHash = function(arr, key) {

        var hash = {};

        for(var x = 0; x < arr.length; x++)
            hash[arr[x][key]] = arr[x];

        return hash;
    };

    var remove = function (keyId) {
        return new Promise(function (resolve, reject) {
            Key.findOne({keyId: keyId}, function (err, key) {
                if (err) return reject(err);
                if (!key) return resolve();

                key.remove(function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    };

    return {
        find: find,
        findOne: findOne,
        fetch: fetchKey,
        validate: validate,
        remove: remove,
        save: save
    }

};

