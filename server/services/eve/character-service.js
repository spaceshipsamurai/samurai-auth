var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird'),
    Alliance = mongoose.model('Alliance'),
    Character = mongoose.model('Character'),
    async = require('async');

module.exports = function() {

    var find = function(options, fields) {

        var query = Character.find(options);

        if(fields)
            query = query.select(fields);

        return query.exec();
    };

    var findOne = function(options, fields) {

        var query = Character.findOne(options);

        if(fields)
            query = query.select(fields);

        return query.exec();
    };

    var getAffiliation = function(cid) {

        return new Promise(function(resolve, reject){

            Character.findOne({ _id: cid }, function(err, character){

                if(err) reject(err);
                if(!character) reject('No character found');

                Alliance.findOne({
                    $and: [{
                        $or: [
                            { coalitionMember: true},
                            { isPrimary: true }
                        ]
                    }, {
                        id: character.alliance.id
                    }]
                }).exec(function(err, alliance){

                    if(err) return reject(err);
                    if(!alliance) return resolve('None');

                    if(alliance.coalitionMember) return resolve('Coalition');
                    if(alliance.isPrimary) return resolve('Alliance');

                });

            });

        });

    };

    var fetch = function(keyId, vCode, characterId) {

        return new Promise(function(resolve, reject){

            if(id && vcode)
            {
                client = new neow.EveClient({
                    keyID: keyId,
                    vCode: vCode
                });
            }
            else {
                return reject('API Key Required');
            }

            client.fetch('char:CharacterSheet', { characterID: characterId })
                .then(function(result){

                    var character = {
                        corporation: {},
                        alliance: {}
                    };

                    character.corporation.id = Number(result.corporationID.content);
                    character.corporation.name = result.corporationName.content;
                    character.name = result.name.content;
                    character.id = Number(result.characterID.content);

                    if(result.allianceID)
                    {
                        character.alliance = {
                            id: Number(result.allianceID.content),
                            name: result.allianceName.content
                        }
                    }
                    else {
                        character.alliance = undefined;
                    }

                    return resolve(character);

                }).catch(function(err){
                    return reject(err);
                });

        });

    };

    var save = function(user, key, character) {

        return new Promise(function(resolve, reject){
            Character.find({ id: character.id }, function(err, existing){

                if(err) return reject(err);

                if(!existing) {
                    existing = new Character({
                        id: character.id,
                        name: character.name
                    });
                }

                existing.user = user;
                existing.key = key;
                existing.corporation = {
                    id: character.corporation.id,
                    name: character.corporation.name
                };

                if(character.alliance)
                {
                    existing.alliance = {
                        id: character.alliance.id,
                        name: character.alliance.name
                    }
                }

                existing.save(function(err, saved){
                    if(err) return reject(err);
                    resolve(saved);
                });

            });
        });


    };

    return {
        find: find,
        findOne: findOne,
        save: save,
        getAffiliation: getAffiliation
    }
};