var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    Key = mongoose.model('Key'),
    Promise = require('bluebird'),
    Logger = require('../../config/logger');

exports.isGroupMember = function(groupId, userId){
    return new Promise(function(resolve, reject){

        Key.aggregate(
            { $match: { userId: userId }},
            { $unwind: '$characters' },
            { $group: { _id: '$userId', characters: { $push: '$characters.id' }}},
            { $project: { userId: '$_id', 'characters': 1, _id: 0 }},
            function(err, result) {

                if(err)
                {
                    Logger.log(Logger.level.critical, 'Error with key aggregate: ' + '\n' + err, ['auth', 'acl', 'db']);
                    return reject(err);
                }


                Group.aggregate(
                    { $match: { _id: groupId }},
                    { $unwind: '$members' },
                    { $match: { 'members.characterId': { $in: result[0].characters}}},
                    { $group: { _id: '$_id', members: { $push: '$members' }}},
                    function(err, groupResult) {

                        if(err)
                        {
                            Logger.log(Logger.level.critical, 'Error with group aggregate: ' + '\n' + err, ['auth', 'acl', 'db']);
                            return reject(err);
                        }

                        resolve({
                            authorized: groupResult[0].members.length > 0,
                            characters: groupResult[0].members
                        });
                    }
                )

            }

        );
    });
};
