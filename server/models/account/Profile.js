var mongoose = require('mongoose'),
    Promise = require('bluebird');

var schema = mongoose.Schema({
    email: { type:String, required: 'Email is required', unique: 'Email already in use' },
    user: mongoose.Schema.ObjectId,
    expires: { required: 'Profile expiration required', type: Date },
    services: {
        forum: {
            characterId: Number,
            forumId: Number,
            name: String
        },
        jabber: {
            username: String,
            nickname: String,
            groups: [{ type: String }]
        },
        teamspeak: {
            uid: String,
            dbId: Number,
            groups: [{ type: Number }]
        }
    },
    key: {
        id: Number,
        mask: Number,
        expires: Date,
        status: { type: String, enum: ['Valid', 'Invalid']}
    },
    character: {
        name: String,
        id: Number
    },
    corporation: {
        name: String,
        id: Number,
        teamspeak: Number,
        jabber: String
    },
    alliance: {
        name: String,
        id: Number,
        teamspeak: Number,
        jabber: String
    },
    groups: [{
            name: String,
            id: mongoose.Schema.ObjectId,
            owner: Boolean,
            manager: Boolean,
            pending: Boolean
    }]

});


var Profile = mongoose.model('Profile', schema);
Promise.promisifyAll(Profile);
Promise.promisifyAll(Profile.prototype);

exports = Profile;






