var mongoose = require('mongoose'),
    neow = require('neow'),
    Promise = require('bluebird'),
    User = mongoose.model('User'),
    Member = mongoose.model('Member'),
    Alliance = mongoose.model('Alliance'),
    Corporation = mongoose.model('Corporation');

exports.isValidEntity = function(acceptCoalition) {
    var self = this;

    acceptCoalition = acceptCoalition || false;

    return new Promise(function(resolve, reject){

        var promises = [];

        if(self.alliance && self.alliance.id != 0)
            promises.push(Alliance.findOne({ id: self.alliance.id, coalitionMember: acceptCoalition, isPrimary: true }).exec());

        promises.push(Corporation.findOne({ id: self.corporation.id, coalitionMember: acceptCoalition }).exec());

        Promise.spread(promises)
            .then(function(alliance, corporation){
                return resolve(alliance || corporation);
            }).catch(function(err){
                return reject(err);
            });

    });
};
