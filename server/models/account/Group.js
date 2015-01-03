var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = mongoose.Schema({
    name: { type: String, required: 'Group Name is required' },
    forumGroupId: Number,
    description: String,
    teamspeakId: Number,
    isPrivate: Boolean,
    createdDate: { type: Date, required: 'Created Date is required' },
    createdBy: { type: Schema.ObjectId, ref: 'User', required: 'Created By is required'},
    owner: { type: Schema.ObjectId, ref: 'User' },
    managers: [{type: Schema.ObjectId, ref: 'User' }]
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;