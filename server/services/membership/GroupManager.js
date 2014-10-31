var Group = require('../../models/Group'),
    Promise = require('bluebird'),
    Logger = require('../../config/logger');

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
