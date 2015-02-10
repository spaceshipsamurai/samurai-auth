var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Key = mongoose.model('Key'),
    Character = mongoose.model('Character'),
    Member = mongoose.model('Member'),
    Group = mongoose.model('Group'),
    async = require('async'),
    logger = require('../../config/logger'),
    allianceService = require('../eve/alliance-service')();

module.exports = function () {

    var deactivate = function(userId) {

        User.findOne({ _id: userId }, function(err, user){

            if(err) {
                logger.error(err, ['account-service','mongoose']);
                return;
            }

            Member.find({ user: user._id }, function(err, members){

                if(err) {
                    logger.error(err, ['account-service','mongoose']);
                    return;
                }

                for(var x = 0; x < members.length; x++)
                {
                    members[x].status = 'Inactive';
                    members[x].save().exec();
                }

            });

        });

    };

    var activate = function(userId) {

        User.findOne({ _id: userId }, function(err, user){

            if(err) {
                logger.error(err, ['account-service','mongoose']);
                return;
            }

            Member.find({ user: user._id }, function(err, members){

                if(err) {
                    logger.error(err, ['account-service','mongoose']);
                    return;
                }

                for(var x = 0; x < members.length; x++)
                {
                    members[x].status = 'Active';
                    members[x].save().exec();
                }

            });

        });

    };

    return {
        deactivate: deactivate,
        activate: activate
    }

};

