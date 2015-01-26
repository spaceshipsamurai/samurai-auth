var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird'),
    User = mongoose.model('User'),
    Member = mongoose.model('Member'),
    Alliance = mongoose.model('Alliance'),
    Corporation = mongoose.model('Corporation');

module.exports = function() {

    var find = function(options, fields) {

        return new Promise(function(resolve, reject){

            var query = Alliance.find(options);

            if(fields)
            {
                query = query.select(fields);
            }

            query.exec(function(err, alliances){

                if(err) {
                    return reject(err);
                }

                resolve(alliances);
            });

        });

    };

    var findOne = function(options, fields) {

        return new Promise(function(resolve, reject){

            var query = Alliance.findOne(options);

            if(fields)
            {
                query = query.select(fields);
            }

            query.exec(function(err, alliances){

                if(err) {
                    return reject(err);
                }

                resolve(alliances);
            });

        });

    };

    var update = function(params) {

        return new Promise(function(resolve, reject){
            Alliance.findOne({ id: params.id }, function(err, alliance){

                if(err){
                    return reject(err);
                }

                if(!alliance) {
                    return reject('Invalid alliance id');
                }

                alliance.watchCorps = params.watchCorps;
                alliance.isPrimary = params.isPrimary;
                alliance.coalitionMember = params.coalitionMember;
                alliance.teamspeakGroup = params.teamspeakGroup;
                alliance.forumGroup = params.forumGroup;
                alliance.jabberGroup = params.jabberGroup;

                alliance.save(function(err, saved){
                    if(err) return reject(err);
                    return resolve(saved);
                });

            });
        });
    };

    //returns 'Primary', 'Coalition', or 'Other'
    var getType = function(id) {

        return new Promise(function(resolve, reject){

            Alliance.findOne({ id: id }, function(err, alliance){

                if(err) return reject(err);

                if(alliance.isPrimary) return resolve('Primary');
                else if(alliance.coalitionMember) return resolve('Coalition');
                else return resolve('Other');

            })

        });

    };

    return {
        find: find,
        findOne: findOne,
        update: update,
        getType: getType
    }

};