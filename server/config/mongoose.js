var mongoose = require('mongoose');


module.exports = function(config) {



    mongoose.connect(config.mongoDb);
    var db = mongoose.connection;

    //load our modules
    require('../models/Key')(mongoose);
    var userModel = require('../models/User')(mongoose);

    db.on("error", function(errorObject){
        console.log(errorObject);
    });

    db.once('open', function() {
        console.log('Mono DB connection open...');
        userModel.createDefaultUsers();
    });



};
