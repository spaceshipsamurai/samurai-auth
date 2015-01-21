/**
 * Created by Russell on 1/10/2015.
 * Creates default cron jobs
 */

var config = require('../server/config/config').getConfig(),
    mongoose = require('mongoose');

mongoose.connect(config.mongoDb);
var db = mongoose.connection;

var Job = require('../server/models/system/CronJob');


db.on("error", function(errorObject){
    console.log(errorObject);
});


db.once('open', function() {
    console.log('Mono DB connection open, starting migration...');

    var complete = function(err, job) {
        if(err) console.log('Error: ' + err);
        else {
            console.log('Created: ' + job.name);
        }
    };

    Job.create({
        name: 'Alliance List Sync',
        script: 'alliance-list-sync',
        interval: {
            increment: 24,
            unit: 'hours'
        },
        history: []
    }, complete);

    Job.create({
        name: 'Corporation List Sync',
        script: 'corp-sync',
        interval: {
            increment: 12,
            unit: 'hours'
        },
        history: []
    }, complete);

    Job.create({
        name: 'Key Sync',
        script: 'key-sync',
        interval: {
            increment: 10,
            unit: 'minutes'
        },
        history: []
    }, complete);

});


