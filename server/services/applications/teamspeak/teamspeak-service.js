var User = require('mongoose').model('User'),
    TeamspeakFactory = require('./teamspeak-factory'),
    MembershipService = require('../../account/membership-service');



module.exports = function(){

    var setId = function(id, uid) {

        return new Promise(function(resolve, reject){

            User.findOne({ _id: id}, function(err, user){

                //TODO: add logging
                if(err) return;
                if(!user) return;

                TeamspeakFactory.getClientInstance().then(function(client){
                    client.send('clientgetdbidfromuid', { cluid: uid }, function(err, response){
                        if(err.id != 0) return reject(err);

                        var services = user.services || {};
                        var teamspeak = services.teamspeak || {};

                        //TODO: if there is an exisitng one, remove it and make sure TS services knows to remove it
                        teamspeak.uid = uid;
                        teamspeak.dbId = response.cldbid;
                        user.save(function(err, saved){

                            MembershipService.getActiveMembershipsByUser(saved._id).then(function(groups){

                                var tsgroups = [];

                                for(var name in groups)
                                {
                                    if(groups[name].teamspeakId)
                                    {
                                        tsgroups.push(groups[name].teamspeakId);
                                    }
                                }

                                syncGroups(saved.services.teamspeak.dbId, tsgroups);

                            });


                            resolve(saved);
                        });
                    });
                });



            });

        });


    };

    var syncGroups = function(id, groups) {


        TeamspeakFactory.getClientInstance().then(function(client){

            client.send('servergroupsbyclientid', { cldbid: id }, function(err, response){

                //TODO: Add logging/reject?
                if(err.id != 0) return;

                if(!response.length)
                {
                    response = [response];
                }

                var memberGroups = response.map(function(g){
                    return g.sgid;
                });

                for(var x = 0; x < memberGroups.length; x++)
                {
                    //guest group is 8, ignore it
                    if(memberGroups[x] === 8) continue;

                    if(groups.indexOf(memberGroups[x]) === -1)
                    {
                        removeGroup(id, memberGroups[x]);
                    }
                }

                for(var x = 0; x < groups.length; x++)
                {
                    if(memberGroups.indexOf(groups[x]) === -1)
                    {
                        addGroup(id, groups[x]);
                    }
                }
            });

        });
    };

    var removeGroup = function(dbid, sgid){
        TeamspeakFactory.getClientInstance().then(function(client){
            client.send('servergroupdelclient', { sgid: sgid, cldbid: dbid }, function(err){
                //TODO: add logging
                if(err.id != 0) console.error(err);
            });
        });
    };

    var addGroup = function(dbid, sgid) {
        TeamspeakFactory.getClientInstance().then(function(client){
            client.send('servergroupaddclient', { sgid: sgid, cldbid: dbid }, function(err){
                //TODO: add logging
                if(err.id != 0) console.error(err);
            })
        });
    };

    var removeGroups = function(uid) {

    };

    return {
        setId: setId
    }

};