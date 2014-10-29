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
                    Logger.log(Logger.level.critical, 'Error saving group: ' + JSON.stringify(group), ['auth', 'create group', 'db']);
                    return reject(err);
                }
            }

            return resolve(savedGroup.toObject());

        });
    });

};