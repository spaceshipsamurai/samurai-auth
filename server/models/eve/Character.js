var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird'),
    User = mongoose.model('User'),
    Member = mongoose.model('Member');


var Schema = mongoose.Schema;

var schema = mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    key: { type: Schema.ObjectId, ref: 'Key' },
    alliance: {
        id: Number,
        name: String
    },
    corporation: {
        id: Number,
        name: String
    },
    updated: Date
});

schema.pre('save', function(next){
    var self = this;
    self.updated = new Date();
    next();
});

schema.methods.syncPrivate = function(id, vcode) {

    var self = this, client;

    return new Promise(function(resolve, reject){

        if(id && vcode)
        {
            client = new neow.EveClient({
                keyID: id,
                vCode: vcode
            });
        }
        else {
            return reject('API Key Required');
        }

        client.fetch('char:CharacterSheet', { characterID: self.id })
            .then(function(result){
                self.corporation.id = Number(result.corporationID.content);
                self.corporation.name = result.corporationName.content;
                self.name = result.name.content;
                if(result.allianceID)
                {
                    self.alliance = {
                        id: Number(result.allianceID.content),
                        name: result.allianceName.content
                    }
                }
                else {
                    self.alliance = undefined;
                }

                self.save(function(err, saved){
                    if(err) {
                        return reject(err);
                    }

                    return resolve(saved);
                })

            }).catch(function(err){
                return reject(err);
            });

    });

};

schema.methods.syncPublic = function() {

    var self = this, client;
    client = new neow.EveClient({});

    return new Promise(function(resolve, reject){

        client.fetch('eve:CharacterInfo', { characterID: self.id })
            .then(function(result){
                self.corporation.id = Number(result.corporationID.content);
                self.corporation.name = result.corporationName.content;
                self.name = result.name.content;
                if(result.allianceID)
                {
                    self.alliance = {
                        id: Number(result.allianceID.content),
                        name: result.allianceName.content
                    }
                }
                else {
                    self.alliance = undefined;
                }

                self.save(function(err, saved){
                    if(err) return reject(err);
                    return resolve(saved);
                })

            }).catch(function(err) {
                return reject(err);
            });
    });

};

schema.methods.makePrimary = function() {

    var self = this;

    User.findOne({ _id: self.user }, function(err, user){
        if(!user) return;
        user.primary = self._id;
        user.save().exec();
    });

};

schema.statics.syncWithKey = function(key) {

    var self = this;

    return new Promise(function(resolve, reject){

        self.find({key: key._id})
            .populate('key')
            .exec(function(err, characters){

                if(err) return reject(err);

                var promises = [];
                var found = [];

                characters = characters.filter(function(c){
                    return c.key.characterIds.indexOf(c.id) > -1;
                });

                var removed = characters.filter(function(c){
                    return c.key.characterIds.indexOf(c.id) === -1;
                });

                for(var x = 0; x < removed.length; x++)
                {
                    promises.push(new Promise(function(resolveInner, rejectInner){
                        var char = removed[x];
                        char.remove(function(err){
                            if(err) return rejectInner(err);
                            return resolve();
                        });
                    }))
                }

                for(var x = 0; x < characters.length; x++)
                {
                    if(key.status === 'Valid')
                    {
                        found.push(characters[x].id);

                        if((key.accessMask & 8) > 0)
                        {
                            promises.push(characters[x].syncPrivate(key.keyId, key.vCode));
                        }
                        else
                        {
                            promises.push(characters[x].syncPublic());
                        }
                    }
                }

                var missing = key.characterIds.filter(function(id){
                    return found.indexOf(id) === -1;
                });

                for(var x = 0; x < missing.length; x++)
                {
                    promises.push(new Promise(function(resolveInner, rejectInner){
                        var id = missing[x];
                        self.create({
                            id: id,
                            user: key.userId,
                            key: key._id
                        }, function(err, saved){
                            if(err) {
                                console.log('ERROR: ' + err);
                                return rejectInner(err);
                            }

                            var promise;
                            if((key.accessMask & 8) > 0)
                            {
                                promise = saved.syncPrivate(key.keyId, key.vCode);
                            }
                            else
                            {
                                promise = saved.syncPublic();
                            }

                            promise.then(function(){
                                return resolveInner();
                            }).catch(function(err){
                                return rejectInner(err);
                            })

                        })

                    }));
                }

                Promise.all(promises).then(function(){
                    return resolve();
                }).catch(function(err){
                    return reject(err);
                });


            });

    });

};

var model = mongoose.model('Character', schema);

module.exports = model;