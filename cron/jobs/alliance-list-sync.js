var Promise = require('bluebird'),
    neow = require('neow'),
    Alliance = require('mongoose').model('Alliance'),
    async = require('async');

var getCorpList = function (data) {

    var corporations = [];

    for (var corp in data)
        corporations.push(Number(corp));

    return corporations;
};

exports.run = function () {

    return new Promise(function (resolve, reject) {

        var client = new neow.EveClient({});

        client.fetch('eve:AllianceList').then(function (result) {

            Alliance.find({})
                .sort('id')
                .exec(function (err, alliances) {

                    if (err) return reject(err);

                    async.map(alliances, function (alliance, cb) {

                        var fetched = result.alliances[alliance.id];

                        if (alliance) {
                            alliance.processed = true;
                            alliance.corporations = getCorpList(fetched.memberCorporations);
                            alliance.memberCount = Number(fetched.memberCount);
                            alliance.executor = Number(fetched.executorCorpID);
                            alliance.save(function (err, saved) {
                                if (err) return cb(err);
                                return cb(null, saved.id);
                            })
                        }
                        else {
                            alliance.remove(function (err) {
                                if (err) return cb(err);
                                else return cb(null, null);
                            });
                        }

                    }, function (err, existing) {

                        if (err) return reject(err);

                        var fetched = [];

                        for (var aid in result.alliances)
                            fetched.push(result.alliances[aid]);

                        async.map(fetched, function (alliance, cb) {

                            if (existing.indexOf(alliance.id) === -1) {
                                Alliance.create({
                                    corporations: getCorpList(alliance.memberCorporations),
                                    started: new Date(alliance.startDate),
                                    memberCount: Number(alliance.memberCount),
                                    executor: Number(alliance.executorCorpID),
                                    id: Number(alliance.allianceID),
                                    ticker: alliance.shortName,
                                    name: alliance.name
                                }, function (err, created) {
                                    if (err) return cb(err, null);
                                    return cb(null, created);
                                })
                            }
                            else {
                                return cb(null, null);
                            }

                        }, function (err) {
                            if (err) return reject(err);
                            return resolve();
                        });

                    });
                });
        }).catch(function (err) {
            reject(err);
        });
    });
};
