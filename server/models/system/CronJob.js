var mongoose = require('mongoose'),
    path = require('path'),
    moment = require('moment'),
    config = require('../../config/config').getConfig(),
    Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = mongoose.Schema({
    name: String,
    nextRun: { type: Date, default: new Date(1970, 0, 0) },
    script: String,
    start: Date,
    interval: {
        increment: Number,
        unit: { type: String, enum: ['hours', 'minutes', 'seconds']}
    },
    status: { type: String, default: 'Idle', enum: ['Idle', 'Running', 'Paused'] },
    history: [{
        time: Date,
        status: String,
        details: Schema.Types.Mixed,
        duration: Number
    }]
});

schema.methods.run = function() {

    var job = require(path.join(config.rootPath, 'cron/jobs/', this.script));
    var self = this;

    var complete = function(data) {

        var start = new moment(self.start);
        self.nextRun = moment().add(self.interval.increment, self.interval.unit);
        self.history.push({
            time: new Date(),
            status: 'Success',
            details: data,
            duration: moment.duration(moment(new Date()).diff(start)).asSeconds()
        });

    };

    var error = function(data) {

        var start = new moment(self.start);
        self.nextRun = moment().add(self.interval, 'seconds');
        self.history.push({
            time: new Date(),
            status: 'Error',
            details: data,
            duration: moment.duration(moment(new Date()).diff(start)).asSeconds()
        });

    };

    var final = function(resolve) {
        return function() {

            self.status = 'Idle';
            self.start = undefined;

            self.save(function(err){
                if(err) console.log(err);
                resolve();
            })
        };
    };

    self.start = new Date();
    self.status = 'Running';

    return new Promise(function(resolve){
        self.save(function(err){
            job.run()
                .then(complete)
                .catch(error)
                .finally(final(resolve));
        });
    });

};

schema.methods.jobComplete = function(data) {

};

var CronJob = mongoose.model('CronJob', schema);

module.exports = CronJob;