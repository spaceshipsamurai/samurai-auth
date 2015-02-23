var mongoose = require('mongoose'),
    logger = require('./logger');

//adds the toObjectId method for converting a string to an objectId
String.prototype.toObjectId = function() {
    var ObjectId = (mongoose.Types.ObjectId);
    return new ObjectId(this.toString());
};


module.exports = function(config) {

    mongoose.connect(config.mongoDb);
    var db = mongoose.connection;

    require('../models');

    db.on("error", function(errorObject){
        logger.error(errorObject, ['mongoose', 'uncaught']);
    });

    db.once('open', function() {
        console.log('Mongo DB connection open...');
    });

};
