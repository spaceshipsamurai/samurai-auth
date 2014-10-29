var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = mongoose.Schema({
    name: { type: String, required: 'Group Name is required' },
    forumGroupId: Number,
    createdDate: { type: Date, required: 'Created Date is required' },
    createdBy: { type: Schema.ObjectId, ref: 'User', required: 'Created By is required'},
    members: [{
        userId: { type: Schema.ObjectId, ref: 'User' },
        characters: [{
            characterId: Number,
            characterName: String,
            approvedDate: Date,
            approvedBy: Schema.ObjectId,
            appliedDate: Date
        }],
        status: { type: String, enum: ['Pending', 'Member', 'Manager', 'Owner', 'Probation']}
    }]
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;