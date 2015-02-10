/**
 * Created by Russell on 1/10/2015.
 * This script pulls jobs of the queue and runs them.
 */



var config = require('../server/config/config').getConfig(),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    logger = require('../server/config/logger');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;


db.on("error", function(errorObject){
    logger.err(errorObject, ['cron', 'mongoose'])
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    require('../server/models');

    var Job = require('mongoose').model('CronJob'),
        moment = require('moment');

    var currentTime = new moment();

    Job.find({ nextRun: { $lt: currentTime }, status: 'Idle' }, function(err, jobs){
        if(err) logger.error(err, ['cron']);
        else {

            var promises = [];

            for(var x = 0; x < jobs.length; x++)
            {
                console.log('Starting: ' + jobs[x].name);
                promises.push(jobs[x].run());
            }

            Promise.all(promises).then(function(){
                mongoose.connection.close();
            }).catch(function(err){
                logger.error(err, ['cron']);
            });
        }
    });

});


