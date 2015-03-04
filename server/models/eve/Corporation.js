var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = Schema({
    id: Number,
    name: String,
    memberCount: Number,
    ceo: {
        id: Number,
        name: String
    },
    description: String,
    station: {
        id: Number,
        name: String
    },
    url: String,
    taxRate: Number,
    ticker: String,
    alliance: {
        id: Number,
        name: String
    },
    ignore: { type: Boolean, default: false },
    coalitionMember: { type: Boolean, default: false },
    teamspeakGroup: Number,
    jabberGroup: String
});

var model = mongoose.model('Corporation', schema);

Promise.promisifyAll(model);
Promise.promisifyAll(model.prototype);

module.exports = model;