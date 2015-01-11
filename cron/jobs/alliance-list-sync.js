var Promise = require('bluebird'),
    neow = require('neow'),
    Alliance = require('mongoose').model('Alliance');

var getCorpList = function(data) {

    var corporations = [];

    for(var corp in data)
        corporations.push(Number(corp));

    return corporations;
};

exports.run = function(){

    return new Promise(function(resolve, reject){

        var client = new neow.EveClient({});

        client.fetch('eve:AllianceList').then(function(result){

            Alliance.find({})
                .sort('id')
                .exec(function(err, alliances){

                    if(err) return reject(err);
                    var promises = [];

                    for(var x = 0; x < alliances.length; x++)
                    {
                        promises.push(new Promise(function(resolveInner, rejectInner){

                            var alliance = result.alliances[alliances[x].id];

                            if(alliance)
                            {
                                alliance.processed = true;
                                alliances[x].corporations = getCorpList(alliance.memberCorporations);
                                alliances[x].memberCount = Number(alliance.memberCount);
                                alliances[x].executor = Number(alliance.executorCorpID);
                                alliances[x].save(function(err){
                                    if(err) return rejectInner(err);
                                    return resolveInner();
                                })
                            }
                            else
                            {
                                alliances[x].remove(function(err){
                                    if(err) return rejectInner(err);
                                    else return resolveInner();
                                });
                            }

                        }));

                    }

                    for(var aid in result.alliances)
                    {
                        if(!result.alliances.processed)
                        {
                            var alliance = result.alliances[aid];

                            promises.push(new Promise(function(resolveInner, rejectInner){
                                Alliance.create({
                                    corporations: getCorpList(alliance.memberCorporations),
                                    started: new Date(alliance.startDate),
                                    memberCount: Number(alliance.memberCount),
                                    executor: Number(alliance.executorCorpID),
                                    id: Number(alliance.allianceID),
                                    ticker: alliance.shortName,
                                    name: alliance.name
                                }, function(err){
                                    if(err) return rejectInner(err);
                                    return resolveInner();
                                })
                            }));

                        }
                    }

                    Promise.all(promises).then(function(){
                        return resolve();
                    }).catch(function(err){
                        return reject(err);
                    })


                });

            resolve('Success');
        }).catch(function(err){
            reject(err);
        });

    });

};
