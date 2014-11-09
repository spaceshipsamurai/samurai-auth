var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    Promise = require('bluebird'),
    Logger = require('../../config/logger'),
    Key = mongoose.model('Key');

var defaultGroups = [
    {
        name: 'Admins',
        forumGroupId: 8,
        createdBy: require('mongoose').Types.ObjectId(),
        createdDate: new Date(),
        members: []
    }
];

var createGroup = Promise.promisify(Group.create, Group);

var find  = function(query) {
    return Promise.cast(Group.find(query).exec());
};

exports.find = find;

exports.seedGroups = function() {
    return find({}).then(function(collection){
        if(collection.length === 0)
        {
            return Promise.map(defaultGroups, function(group) {
                return createGroup(group);
            });
        }
    });
};

exports.create = function(group){

    return new Promise(function(resolve, reject) {

        var newGroup = new Group(group);

        newGroup.save(function(err, savedGroup) {

            if(err)
            {
                if(err.name == 'ValidationError')
                {
                    return reject(err.errors);
                }
                else
                {
                    Logger.log(Logger.level.critical, 'Error saving group: ' + JSON.stringify(group) + '\n' + err, ['auth', 'group', 'db']);
                    return reject(err);
                }
            }

            return resolve(savedGroup.toObject());

        });
    });
};

exports.submitApplication = function(application) {
    return new Promise(function(resolve, reject){

        Group.findOne({_id: application.groupId }, function(err, group){

            if(err)
            {
                Logger.log(Logger.level.critical, 'Error saving group application: ' + JSON.stringify(application) + '\n' + err, ['auth', 'group', 'db']);
                return reject(err);
            }

            if(!group)
            {
                return reject('No group found for group ID: ' + application.groupId);
            }

            if(!group.members)
            {
                group.members = [];
            }

            group.members.push({
                characterId: application.character.id,
                characterName: application.character.name,
                appliedDate: new Date(),
                status: 'Pending'
            });

            group.save(function(err) {

                if(err)
                {
                    Logger.log(Logger.level.critical, 'Error saving group application: ' + JSON.stringify(application) + '\n' + err, ['auth', 'group', 'db']);
                    return reject(err);
                }

                resolve();
            });

        });
    });
};

exports.approveMember = function(approval) {
    return new Promise(function(resolve, reject){

        Group.update({ _id: approval.groupId, 'members.characterId': approval.characterId },
            {
                $set: {
                    'members.$.status': 'Member',
                    'members.$.approvedBy': approval.approvedBy,
                    'members.$.approvedDate': new Date()
                }
            },
            function(err) {

                if (err) {
                    Logger.log(Logger.level.critical, 'Error approving member: ' + JSON.stringify(approval) + '\n' + err, ['auth', 'group', 'db']);
                    return reject(err);
                }

                resolve();
            }
        );
    });
};

exports.removeMember = function(groupId, characterId) {
    return new Promise(function(resolve, reject){
        Group.update({_id: groupId }, { $pull: {'members': { characterId: characterId }}}, function(err) {

            if (err) {
                Logger.log(Logger.level.critical, 'Error removing member: ' + err, ['auth', 'group', 'db']);
                return reject(err);
            }

            resolve();
        });
    });
};

exports.getGroupsByUser = function(userId) {

    return new Promise(function(resolve, reject){

        Key.find({userId: userId, status: 'Valid'}, function(err, keys){

           var characters = [];

            for(var x = 0; x < keys.length; x++)
            {
                for(var y = 0; y < keys[x].characters.length; y++)
                {
                    characters.push(keys[x].characters[y].id);
                }
            }

            Group.find({'members.userId': userId, 'members.characterId': { $in: characters }}, 'name _id', function(err, groups){

                var obj = groups.reduce(function(o, v) {
                    o[v.name] = v;
                    return o;
                }, {});

                resolve(obj);
            });

        });
    });

};

exports.isGroupMember = function(groupId, userId){
    return new Promise(function(resolve, reject){

        Key.aggregate(
            { $match: { userId: userId, status: 'Valid' }},
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