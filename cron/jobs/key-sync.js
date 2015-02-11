/**
 * Created by Russell on 1/10/2015.
 * The purpose of this script is to select the top X
 * oldest, active keys and run a sync process that
 * fetches the latest info from Eve API and
 * verifies everything is still valid
 */

var Promise = require('bluebird'),
    async = require('async'),
    accountService = require('../../server/services/account/account-service')(),
    keyService = require('../../server/services/eve/key-service')(),
    Key = require('mongoose').model('Key');


exports.run = function(){

    var process = function(key, cb) {


        keyService.fetch(key.keyId, key.vCode).then(function(rawKey){

            rawKey._id = key.userId;
            rawKey.userId = key.userId;

            keyService.save(rawKey).then(function(saved){

                if(saved.status === 'Invalid')
                {
                    accountService.deactivate(key.userId);
                }

                return cb(null, saved)

            }).catch(function(err){
                cb(err);
            });
        }).catch(function(err){

            key.status = 'Invalid';
            key.validationErros = [err];
            key.save(function(err){

                if(err) return cb(err);
                return cb();

            });
        });

    };

    return new Promise(function(resolve, reject){

        Key.find({ status: 'Valid' })
            .sort({ lastCheck: 1 })
            .limit(20)
            .exec(function(err, keys){

                async.map(keys, process, function(err, results){
                    if(err) return reject({
                        message: err.message,
                        stack: err.stack,
                        type: err.type,
                        raw: err.toString()
                    });

                    else return resolve();
                });

            });

    });

};
