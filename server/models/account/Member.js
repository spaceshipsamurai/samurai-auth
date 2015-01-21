var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = mongoose.Schema({
    group: { type: Schema.ObjectId, ref: 'Group'},
    user: { type: Schema.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Active', 'Inactive']},
    approvedDate: Date,
    approvedBy: Schema.ObjectId,
    appliedDate: Date,
    owner: Boolean,
    manager: Boolean
});



var Model = mongoose.model('Member', schema);

module.exports = Model;