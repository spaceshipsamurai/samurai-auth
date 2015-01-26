var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Key = mongoose.model('Key'),
    Character = mongoose.model('Character'),
    Member = mongoose.model('Member'),
    Group = mongoose.model('Group'),
    async = require('async'),
    allianceService = require('../eve/alliance-service')();

module.exports = function () {

    var setAllMemberships = function(status, memberships) {

        var promises = [];

        for(var x = 0; x < memberships.length; x++) {
            memberships[x].status = status;
            promises.push(Promise.promisify(memberships[x].save, memberships[x]));
        }

        return Promise.all(promises);

    };

    var sync = function (userId) {

        return new Promise(function (resolve, reject) {

            User.findOne({_id: userId}, function (err, user) {

                if(err) return reject(err);

                async.parallel([function (cb) {
                    Member.find({user: user._id})
                        .populate('group')
                        .exec(function (err, members) {
                            if (err) return cb(err, null);
                            cb(null, members);
                        })
                }, function (cb) {
                    Key.findOne({characters: user.primary})
                        .populate('characters')
                        .exec(function (err, key) {
                            if (err) return cb(err, null);
                            cb(null, key);
                        });
                }], function (err, results) {

                    if (err) return reject(err);

                    var members = results[0];
                    var key = results[1];
                    var character;

                    if(key.status === 'Invalid')
                    {
                        setAllMemberships('Inactive', members).then(function(){
                            return resolve();
                        })
                    }

                    var chars = key.characters.filter(function (c) {
                        return c._id.equals(user.primary);
                    });

                    if (chars)
                        character = chars[0];
                    else
                        return reject('Error trying to find primary character');

                    if (!character.alliance || character.alliance.id == 0) {
                        setAllMemberships('Inactive', members).then(function(){
                            return resolve();
                        });
                    }


                    allianceService.getType(character.alliance.id).then(function (type) {
                        if (type === 'Primary') {
                            setAllMemberships('Active', members).then(function(){
                                return resolve();
                            })
                        }
                        else {
                            setAllMemberships('Inactive', members).then(function(){
                                return resolve();
                            })
                        }
                    });


                })

            });

        });

    };


    return {
        sync: sync
    }

};

