var Member = require('mongoose').model('Member'),
    Promise = require('bluebird');

exports.apply = function(groupId, userId) {

    return new Promise(function (resolve, reject) {

        Member.findOne({ user: userId, group: groupId }, function(err, existing){
            if(err) return reject(err);
            if(existing) return resolve(existing);

            var member = new Member({
                group: groupId,
                user: userId,
                status: 'Pending',
                appliedDate: new Date(),
                owner: false,
                manager: false
            });

            member.save(function(err, saved){
                if(err) reject(err);
                else resolve(saved);
            });

        });

    });
};

exports.getPendingByUser = function(userId) {

    return new Promise(function(resolve, reject){

        Member.find({ user: userId, status: 'Pending' }, 'group')
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