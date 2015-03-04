var mongoose = require('mongoose'),
    Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = mongoose.Schema({
    corporations: [ Number ],
    started: Date,
    memberCount: Number,
    id: { type: Number, unique: true },
    executor: Number,
    ticker: String,
    name: String,
    watchCorps: { type: Boolean, default: false },
    coalitionMember: { type: Boolean, default: false },
    isPrimary: { type: Boolean, default: false },
    forumGroup: Number,
    teamspeakGroup: Number,
    jabberGroup: String,
    updated: Date
});

schema.pre('save', function(next){
    this.updated = new Date();
    next();
});

var Alliance = mongoose.model('Alliance', schema);

Promise.promisifyAll(Alliance);
Promise.promisifyAll(Alliance.prototype);

module.exports = Alliance;