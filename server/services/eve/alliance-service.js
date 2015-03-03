var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird'),
    User = mongoose.model('User'),
    Member = mongoose.model('Member'),
    Alliance = mongoose.model('Alliance'),
    Corporation = mongoose.model('Corporation'),
    async = require('async');

module.exports = function () {

    var find = function (options, fields) {

        return new Promise(function (resolve, reject) {

            var query = Alliance.find(options);

            if (fields) {
                query = query.select(fields);
            }

            query.exec(function (err, alliances) {

                if (err) {
                    return reject(err);
                }

                resolve(alliances);
            });

        });

    };

    var findOne = function (options, fields) {

        return new Promise(function (resolve, reject) {

            var query = Alliance.findOne(options);

            if (fields) {
                query = query.select(fields);
            }

            query.exec(function (err, alliances) {

                if (err) {
                    return reject(err);
                }

                resolve(alliances);
            });

        });

    };

    var update = function (params) {

        return new Promise(function (resolve, reject) {
            Alliance.findOne({id: params.id}, function (err, alliance) {

                if (err) {
                    return reject(err);
                }

                if (!alliance) {
                    return reject('Invalid alliance id');
                }

                alliance.watchCorps = params.watchCorps;
                alliance.isPrimary = params.isPrimary;
                alliance.coalitionMember = params.coalitionMember;
                alliance.teamspeakGroup = params.teamspeakGroup;
                alliance.forumGroup = params.forumGroup;
                alliance.jabberGroup = params.jabberGroup;

                alliance.save(function (err, saved) {
                    if (err) return reject(err);
                    return resolve(saved);
                });

            });
        });
    };

    //returns 'Primary', 'Coalition', or 'Other'
    var getType = function (id) {

        return new Promise(function (resolve, reject) {

            Alliance.findOne({id: id}, function (err, alliance) {

                if (err) return reject(err);

                if (alliance.isPrimary) return resolve('Primary');
                else if (alliance.coalitionMember) return resolve('Coalition');
                else return resolve('Other');

            })

        });

    };

    var fetchAlliances = function() {
        return new Promise(function(resolve, reject){
            var client = new neow.EveClient({});
            client.fetch('eve:AllianceList').then(resolve).catch(reject);
        });
    };

    var sync = function () {

        return fetchAlliances()
            .then(function(fetched){
                fetched = fetched.alliances;
                var alliances = [];

                for(var id in fetched)
                    alliances.push(id);

                async.each(alliances, function(id, cb){

                    Alliance.findOne({ id: id }, function(err, alliance){

                        if(err) return cb(err);
                        if(!alliance) alliance = new Alliance();

                        var data = fetched[id];

                        alliance.memberCount = Number(data.memberCount);
                        alliance.executor = Number(data.executorCorpID);
                        alliance.started = new Date(data.startDate);
                        alliance.id = Number(data.allianceID);
                        alliance.ticker = data.shortName;
                        alliance.name = data.name;
                        alliance.corporations = [];

                        for(var corp in data.memberCorporations)
                            alliance.corporations.push(Number(corp));

                        alliance.save(function(err, saved){
                            if(err) return cb(err);
                            return cb();
                        })
                    });
                }, function(err){
                    if(err) return Promise.reject(err);
                    return Promise.resolve();
                })
            })

    };

    return {
        find: find,
        findOne: findOne,
        update: update,
        getType: getType,
        sync: sync
    }

};