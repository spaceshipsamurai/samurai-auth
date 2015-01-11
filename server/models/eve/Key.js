var mongoose = require('mongoose'),
    Character = require('./Character'),
    neow = require('neow'),
    Promise = require('bluebird');

var Schema = mongoose.Schema;

var keySchema = mongoose.Schema({
    userId: { type: Schema.ObjectId },
    keyId: { type: Number, required: 'Key Id is required', unique: 'Key Id is already in use'},
    vCode: String,
    accessMask: Number,
    keyType: String,
    expires: Date,
    lastCheck: Date,
    status: { type: String, enum: ['Valid', 'Invalid']},
    validationErrors: [{ type: String }],
    error: [{ type: String }],
    characters: [{ type: Schema.ObjectId, ref: 'Character' }],
    characterIds: [ { type: Number } ],
    updated: Date
});

keySchema.pre('remove', function(next){

    var self = this;

    Character.remove({ key: self._id }).exec(function(err){
        if(err) console.log(err);
    });

    next();
});

keySchema.pre('save', function(next){

    var errors = [];
    var self = this;

    //access mask validation
    var access = self.accessMask | 1; //account balance
    access = access | 4096; //market orders
    access = access | 4194304; //Wallet Transactions

    if(access !== 268435455) errors.push('Invalid Access Mask');
    if(self.keyType !== 'Account') errors.push('Key Type must be \'Account\'');

    if(errors.length > 0) {
        self.status = 'Invalid';

        if(self.validationErrors && self.validationErrors.length > 1)
            self.validationErrors.concat(errors);
        else
            self.validationErrors = errors;
    }

    self.updated = new Date();

    next();

});

keySchema.methods.sync = function() {

    var client, self = this;

    client = new neow.EveClient({
        keyID: self.keyId,
        vCode: self.vCode
    });

    return new Promise(function(resolve, reject){

        client.fetch('account:APIKeyInfo')
            .then(function(result){

                var data = result.key;

                self.accessMask = data.accessMask;
                self.keyType = data.type;
                self.expires = data.expires;
                self.lastCheck = new Date();

                var ids = [];

                for(var id in data.characters)
                    ids.push(id);

                self.characterIds = ids;

                self.save(function(err, key){
                    if(err) return reject(err);

                    Character.syncWithKey(key).then(function(){
                        return resolve();
                    }).catch(function(err){
                        return reject(err);
                    });
                });

            }).catch(function(error){
                self.status = 'Invalid';
                self.validationErrors = ['Processing Error, see IT'];
                self.error = [error];
                self.save(function(err, key){
                    if(err) debug(err);
                    else debug('Error processing: ' + key._id);
                })
            });

    });



};

var Key = mongoose.model('Key', keySchema);

module.exports = Key;