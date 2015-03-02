var encrypt = require('../../services/encryption');
var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    email: { type:String, required: 'Email is required', unique: 'Email already in use' },
    password: { type:String, required: 'Password is required' },
    salt: String,
    dateCreated: {  type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
    lastSignIn: { type: Date, default: Date.now },
    lastIP: String,
    confirmationId: { type: String },
    confirmationDate: { type: Date },
    passwordResetId: { type: String },
    passwordResetExpires: { type: Date },
    services: {
        forum: {
            characterId: Number,
            forumId: Number,
            name: String
        },
        jabber: {
            username: String,
            character: { type: mongoose.Schema.ObjectId, ref: 'Character' }
        },
        teamspeak: {
            uid: String,
            dbId: Number
        }
    },
    primary: { type: mongoose.Schema.ObjectId , ref: 'Character' }
});

userSchema.methods = {
    authenticate: function(password) {
        return encrypt.hashValue(password, this.salt) === this.password;
    }
};

var User = mongoose.model('User', userSchema);

User.schema.path('email').validate(function(value) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(value);
}, 'Invalid email address');

var createDefaultUsers = function() {
    User.find({}).exec(function(err, collection){
        if(collection.length === 0){

            var salt, hash;

            salt = encrypt.createSalt();
            hash = encrypt.hashValue('test', salt);
            User.create({
                email: 'test@example.com',
                password: hash,
                salt: salt,
                lastIP: '127.0.0.1'
            });
        }
    });
};

exports = User;
exports.createDefaultUsers = createDefaultUsers;





