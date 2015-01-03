var Member = require('mongoose').model('Member'),
    Promise = require('bluebird');

exports.apply = function(groupId, application) {

    return new Promise(function (resolve, reject) {

        Member.findOne({ userId: application.userId, group: groupId }, function(err, member){
            if(err) return reject(err);

            if(!member){
                member = new Member({
                    group: groupId,
                    userId: application.userId,
                    characters: []
                });
            }

            member.characters.push({
                id: application.character.id,
                name: application.character.name,
                appliedDate: new Date(),
                status: 'Pending'
            });

            member.save(function(err, savedMember){
                if(err) reject(err);

                resolve(savedMember);
            });

        });

    });
};

exports.getActiveMembershipsByUser = function(userId) {

    return new Promise(function(resolve, reject){

        Member.find({ user: userId, status: 'Active' }, 'group')
            .populate('group')
            .exec(function(err, memberships){
                var groups = {
                    count: memberships.length
                };

                for(var x = 0; x < memberships.length; x++)
                {
                    groups[memberships[x].group.name] = memberships[x].group;
                }


                return resolve(groups);
            });

    });

};