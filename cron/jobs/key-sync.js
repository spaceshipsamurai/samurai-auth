/**
 * Created by Russell on 1/10/2015.
 * The purpose of this script is to select the top X
 * oldest, active keys and run a sync process that
 * fetches the latest info from Eve API and
 * verifies everything is still valid
 */

var Promise = require('bluebird'),
    Key = require('mongoose').model('Key'),
    async = require('async'),
    acountService = require('../../server/services/account/account-service')();

exports.run = function(){

    var process = function(key, cb) {

        key.sync().then(function(){

            acountService.sync(key.userId).then(function(){
                return cb();
            }).catch(function(err){
                return cb(err);
            });

        }).catch(function(err){
            return cb(err);
        });

    };

    return new Promise(function(resolve, reject){

        Key.find({ status: 'Valid' })
            .sort({ lastCheck: 1 })
            .limit(20)
            .exec(function(err, keys){

                async.map(keys, process, function(err, results){
                    if(err) return reject(err);
                    else return resolve(results);
                });

            });

    });

};
