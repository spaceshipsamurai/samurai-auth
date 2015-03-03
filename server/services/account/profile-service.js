var mongoose = require('mongoose'),
    Profile = mongoose.model('Profile'),
    User = mongoose.model('User'),
    async = require('async'),
    Promise = require('bluebird'),
    Membership = require('./membership-service'),
    Alliances = require('../eve/alliance-service')(),
    Corporations = require('../eve/corporation-service')(),
    Keys = require('../eve/key-service')();


var rebuildGroups = function (uid) {

    return Promise.props({
        profile: Profile.findOne({user: uid}).populate('group').exec(),
        memberships: Membership.findByUser(uid)
    }).then(function (result) {

        if (!result.profile) return rebuildProfile(uid);

        var memberships = result.memberships;
        result.profile.groups = [];
        result.profile.services.teamspeak.groups = [];
        result.profile.services.jabber.groups = [];

        for (var x = 0; x < memberships.length; x++) {
            var group = memberships[x].group;

            if (group.teamspeakId && group.teamspeakId != 0)
                result.profile.services.teamspeak.groups.push(group.teamspeakId);

            if (group.jabberId && group.jabberId != '')
                result.profile.services.jabber.groups.push(group.jabberId);

            result.profile.groups.push({
                name: group.name,
                id: group._id,
                owner: group.owner.toString() === uid.toString(),
                manager: group.managers.indexOf(uid) > -1,
                pending: memberships[x].status === 'Pending'
            })
        }

        if (result.profile.corporation && result.profile.corporation.teamspeak)
            result.profile.services.teamspeak.groups.push(result.profile.corporation.teamspeak);

        if (result.profile.corporation.jabber && result.profile.corporation.jabber)
            result.profile.services.jabber.groups.push(result.profile.corporation.jabber);

        if (result.profile.alliance && result.profile.alliance.teamspeak)
            result.profile.services.teamspeak.groups.push(result.profile.alliance.teamspeak);

        if (result.profile.alliance.jabber && result.profile.alliance.jabber)
            result.profile.services.jabber.groups.push(result.profile.alliance.jabber);

        return result.profile.saveAsync();

    });
};

var rebuildProfile = function (uid) {

    return new Promise(function (resolve, reject) {

        User.findOne({_id: uid})
            .populate('primary')
            .exec(function (err, user) {

                if (err) return reject(err);
                if (!user) return resolve();
                Profile.findOneAndRemoveAsync({user: uid})
                    .then(function () {

                        var alliancePromise;

                        if (!user.primary.alliance) {
                            alliancePromise = Promise.resolve();
                        }
                        else {
                            alliancePromise = Alliances.findOne({id: user.primary.alliance.id});
                        }

                        return Promise.props({
                            alliance: alliancePromise,
                            corporation: Corporations.findById(user.primary.corporation.id),
                            key: Keys.findOne({userId: uid, characters: user.primary._id})
                        })
                    })
                    .then(function (result) {

                        var expiration = new Date();
                        expiration.setHours(expiration.getHours() + 2);

                        var profile = new Profile({
                            user: user._id,
                            email: user.email,
                            expires: expiration,
                            character: {
                                name: user.primary.name,
                                id: user.primary.id
                            }
                        });

                        if (result.key) {
                            profile.key = {
                                id: result.key.keyId,
                                mask: result.key.accessMask,
                                expires: result.key.expires,
                                status: result.key.status
                            }
                        }
                        else {
                            profile.key = {
                                id: 0,
                                mask: 0,
                                status: 'Invalid'
                            }
                        }

                        if (result.alliance) {
                            profile.alliance = {
                                name: user.primary.alliance.name,
                                id: user.primary.alliance.id,
                                teamspeak: result.alliance.teamspeakGroup,
                                jabber: result.alliance.jabberGroup
                            }
                        }

                        if (result.corporation) {
                            profile.corporation = {
                                name: user.primary.corporation.name,
                                id: user.primary.corporation.id,
                                teamspeak: result.corporation.teamspeakGroup,
                                jabber: result.corporation.jabberGroup
                            }
                        }

                        if (user.services) {
                            var services = user.services;

                            if (services.teamspeak) {
                                profile.services.teamspeak = {
                                    uid: services.teamspeak.uid,
                                    dbId: services.teamspeak.dbId,
                                    groups: []
                                }
                            }

                            if (services.jabber) {
                                profile.services.jabber = {
                                    username: services.jabber.username,
                                    nickname: user.primary.name,
                                    groups: []
                                }
                            }

                        }
                        return profile.saveAsync();
                    }).then(function () {

                        Promise.all([rebuildGroups(uid)])
                            .then(function () {
                                return resolve();
                            }).catch(function (e) {
                                return reject(e);
                            })

                    }).catch(function (err) {
                        reject(err);
                    });
            })

    });

};

module.exports = {
    rebuildProfile: rebuildProfile
};

