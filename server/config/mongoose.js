var mongoose = require('mongoose'),
    logger = require('./logger');


module.exports = function(config) {

    mongoose.connect(config.mongoDb);
    var db = mongoose.connection;

    require('../models');

    db.on("error", function(errorObject){
        logger.log(logger.level.critical, errorObject);
    });

    db.once('open', function() {
        console.log('Mono DB connection open...');
    });

};
