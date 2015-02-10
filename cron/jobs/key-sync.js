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
    keyService = require('../../server/services/eve/key-service')();


exports.run = function(){

    var process = function(key, cb) {

        var user = key.userId;

        keyService.fetch(key.keyId, key.vCode).then(function(rawKey){
            return keyService.save(rawKey);
        }).then(function(saved){

            if(saved.status === 'Invalid')
            {
                accountService.deactivate(user._id);
            }

            return cb()
        }).catch(function(err){
            return cb(err);
        });

    };

    return new Promise(function(resolve, reject){

        Key.find({ status: 'Valid' })
            .sort({ lastCheck: 1 })
            .limit(20)
            .populate('userId')
            .exec(function(err, keys){

                async.map(keys, process, function(err, results){
                    if(err) return reject(err);
                    else return resolve(results);
                });

            });

    });

};
