var mongoose = require('mongoose'),
    Corporation = mongoose.model('Corporation'),
    Promise = require('bluebird'),
    Logger = require('../../config/logger');

module.exports = function() {

    var find = function(options) {

        return new Promise(function(resolve, reject){

            Corporation.find(options, function(err, corps){

                if(err)
                {
                    Logger.log(Logger.level.critical, err, ['mongoose', 'corporation-service', 'find'])
                    return reject(err);
                }

                return resolve(corps);

            });

        });

    };

    return {
        find: find
    }
};
