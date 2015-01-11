/**
 * Created by Russell on 1/10/2015.
 * The purpose of this script is to select the top 10
 * oldest, active keys and run a sync process that
 * fetches the latest info from Eve API and
 * verifies everything is still valid
 */

var Promise = require('bluebird'),
    Key = require('mongoose').model('Key');

exports.run = function(){

    return new Promise(function(resolve, reject){

        Key.find({ status: 'Valid' })
            .sort({ lastCheck: 1 })
            .limit(20)
            .exec(function(err, keys){

                var promises = [];

                for(var x = 0; x < keys.length; x++)
                {
                    promises.push(keys[x].sync());
                }

                Promise.all(promises).then(function(){
                    resolve();
                }).catch(function(err){
                    reject(err);
                });

            });

    });

};
