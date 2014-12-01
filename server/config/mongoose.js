var mongoose = require('mongoose'),
    logger = require('./logger'),
    samuraiMembership = require('samurai-membership');


module.exports = function(config) {

    mongoose.connect(config.mongoDb);
    var db = mongoose.connection;
    samuraiMembership.connect(config.mongoDb);
    require('../models/Recruit');

    require('../models/User');

    db.on("error", function(errorObject){
        logger.log(logger.level.critical, errorObject);
    });

    db.once('open', function() {
        console.log('Mono DB connection open...');
    });

};
