var Promise = require('bluebird'),
    Corporation = require('mongoose').model('Corporation'),
    Alliance = require('mongoose').model('Alliance');

exports.run = function(){

    return new Promise(function(resolve, reject){

        Alliance.find({ watchCorps: true }, function(err, alliances){

            var promises = [];

            for(var x = 0; x < alliances.length; x++)
            {
                for(var c = 0; c < alliances[x].corporations.length; c++)
                {
                    promises.push(Corporation.upsertSync(alliances[x].corporations[c]));
                }
            }

            Promise.all(promises).then(function(){
                resolve();
            }).catch(function(err){
                reject(err);
            });

        });

    });

};
