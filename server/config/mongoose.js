var mongoose = require('mongoose'),
    logger = require('./logger');


module.exports = function(config) {

    mongoose.connect(config.mongoDb);
    var db = mongoose.connection;

    //load our models
    require('../models/Key');
    require('../models/Group');

    var userModel = require('../models/User');

    db.on("error", function(errorObject){
        logger.log(logger.level.critical, errorObject);
    });

    var GroupManager = require('../services/membership/GroupManager');

    db.once('open', function() {
        console.log('Mono DB connection open...');
        //userModel.createDefaultUsers();
        GroupManager.seedGroups();
    });

};
