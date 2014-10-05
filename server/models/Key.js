module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var keySchema = mongoose.Schema({
        userId: { type: Schema.ObjectId },
        keyId: { type: Number, required: 'Key Id is required', unique: 'Key Id is already in use'},
        vCode: String,
        accessMask: Number,
        keyType: String,
        expires: Date,
        lastCheck: Date,
        characters: [{
            name: String,
            isPrimary: Boolean,
            corporation: {
                id: Number,
                name: String
            },
            alliance: {
                id: Number,
                name: String
            },
            id: Number
        }]
    });

    mongoose.model('Key', keySchema);

}

