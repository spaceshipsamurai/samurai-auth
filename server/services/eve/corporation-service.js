var mongoose = require('mongoose'),
    Corporation = mongoose.model('Corporation'),
    Alliance = mongoose.model('Alliance'),
    Promise = require('bluebird'),
    Logger = require('../../config/logger'),
    async = require('async'),
    neow = require('neow');

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

    var fetch = function(corpId) {

        var client = new neow.EveClient({});

        return client.fetch('corp:CorporationSheet', { corporationID: corpId })
            .then(function(result){

                var corp = {};

                corp.id = Number(result.corporationID.content);
                corp.name = result.corporationName.content;
                corp.memberCount = Number(result.memberCount.content);
                corp.ceo = {
                    id: Number(result.ceoID.content),
                    name: result.ceoName.content
                };
                corp.station = {
                    id: Number(result.stationID.content),
                    name: result.stationName.content
                };
                corp.description = result.description.content;
                corp.url = result.url.content;
                corp.taxRate = Number(result.taxRate.content);
                corp.ticker = result.ticker.content;
                corp.alliance = {
                    id: result.allianceID.content,
                    name: result.allianceName.content
                };

                return Promise.resolve(corp);

            });

    };

    var syncAllianceCorps = function(aid, corps) {

        return new Promise(function(resolve, reject){
            async.each(corps, function(id, cb){

                Promise.props({
                    fetched: fetch(id),
                    existing: Corporation.findOneAsync({ id: id })
                }).then(function(result) {

                    var fetched = result.fetched;
                    var existing = result.existing;

                    if(!existing) existing = new Corporation();

                    existing.id = fetched.id;
                    existing.name = fetched.name;
                    existing.memberCount = fetched.memberCount;
                    existing.ceo = {
                        id: fetched.ceo.id,
                        name: fetched.ceo.name
                    };
                    existing.station = {
                        id: fetched.station.id,
                        name: fetched.station.name
                    };
                    existing.description = fetched.description;
                    existing.url = fetched.url;
                    existing.taxRate = fetched.taxRate;
                    existing.ticker = fetched.ticker;
                    existing.alliance = {
                        id: fetched.alliance.id,
                        name: fetched.alliance.name
                    };

                    return existing.saveAsync();


                }).then(function(){
                    cb();
                }).catch(cb);
            }, function(err){
                if(err) return reject(err);

                Corporation.findAsync({
                    'alliance.id': aid,
                    id: { $not: { $in: corps } }
                }).then(function(corporations){
                    return Promise.each(corporations, function(corp){
                        return corp.removeAsync();
                    })
                }).then(resolve).catch(reject);
            });
        });

    };

    var sync = function() {

        return Alliance.findAsync({ $or: [
            { isPrimary: true },
            { watchCorps: true }
        ]}).then(function(alliances){
            return Promise.each(alliances, function(alliance){
                return syncAllianceCorps(alliance.id, alliance.corporations);
            });
        });

    };



    return {
        find: find,
        findById: findById,
        sync: sync
    }
};
