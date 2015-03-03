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

    var findById = function(id) {

        return new Promise(function(resolve, reject){

            Corporation.findOne({ id: id }, function(err, corp){

                if(err)
                {
                    Logger.log(Logger.level.critical, err, ['mongoose', 'corporation-service', 'findById']);
                    return reject(err);
                }

                return resolve(corp);

            });

        });

    };

    return {
        find: find,
        findById: findById
    }
};
