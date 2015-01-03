var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var recruitSchema = mongoose.Schema({
    createdDate: Date,
    createdBy: Schema.ObjectId,
    corporation: Number,
    name: String,
    system: String,
    lockExpires: Date,
    lockUser: Schema.ObjectId,
    mailDate: Date,
    isLocked: { type: Boolean, default: false }
});

recruitSchema.index({ name: 1, corporation: 1}, { unique: true });

mongoose.model('Recruit', recruitSchema);

