var mongoose = require('mongoose'),
    Character = require('./Character'),
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
    characters: [{ type: Schema.ObjectId, ref: 'Character' }],
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

    var validationErrors = this.verify();

    if(validationErrors.length > 0) {
        this.validationErrors = validationErrors;
        this.status = 'Invalid';
    }

    this.updated = new Date();
    next();

});

keySchema.methods.verify = function() {

        var errors = [];

        //access mask validation
        var access = this.accessMask | 1; //account balance
        access = access | 4096; //market orders
        access = access | 4194304; //Wallet Transactions

        if (access !== 268435455) errors.push('Invalid Access Mask');
        if (this.keyType !== 'Account') errors.push('Key Type must be \'Account\'');

        return errors;
};

var Key = mongoose.model('Key', keySchema);

module.exports = Key;