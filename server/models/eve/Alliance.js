var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = mongoose.Schema({
    corporations: [ Number ],
    started: Date,
    memberCount: Number,
    id: { type: Number, unique: true },
    executor: Number,
    ticker: String,
    name: String,
    watchCorps: { type: Boolean, default: false }
});

var Alliance = mongoose.model('Alliance', schema);

module.exports = Alliance;