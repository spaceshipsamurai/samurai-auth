var request = require('request'),
    Promise = require('bluebird'),
    parseXML = require('xml2js').parseString,
    Membership = require('./account/membership-service'),
    Character = require('mongoose').model('Character'),
    config = require('../config/config').getConfig();

var getUser = function(username) {

    var options = {
        url: config.jabber.userEndpoint + '/users/' + username,
        headers: {
            'Authorization': config.jabber.secret
        }
    };

    return new Promise(function(resolve){

        request(options, function(err, response, body){

            if(response.statusCode === 404) return resolve(undefined);
            else return resolve(parseXML(body));

        });

    });

};

exports.updateUser = function(user) {

    var options = {
        headers: {
            'Authorization': config.jabber.secret
        }
    };

    return new Promise(function(resolve, reject){

        Character.findOne({ _id: user.character }, function(err, character){

            getUser(user.username).then(function(openUser){

                if(!openUser) {
                    options.url = config.jabber.userEndpoint + '/users';
                    var data = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
                    data += '<user>';
                    data += '<username>'+ user.username +'</username>';
                    data += '<password>'+ user.password +'</password>';
                    data += '<name>'+ character.name +'</name>';
                    data += '</user>';

                    options.body = data;
                    options.headers['Content-Type'] =  'text/xml';

                    request.post(options, function(error, response, body){
                        if (!error && response.statusCode == 201) {
                            console.log('updated ' + user.username);
                        }
                        else{
                            console.log('post');
                            console.log('status: ' + response.statusCode);
                            console.log('error: ' + error);
                            console.log('body: ' + body);
                            return reject();
                        }
                    })
                }
                else{
                    options.url = config.jabber.userEndpoint + '/users/' + user.username;
                    var data = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
                    data += '<user>';
                    data += '<username>'+ user.username +'</username>';
                    data += '<password>'+ user.password +'</password>';
                    data += '</user>';

                    options.body = data;
                    options.headers['Content-Type'] =  'text/xml';

                    request.put(options, function(error, response, body){
                        if (!error && response.statusCode == 200) {
                            console.log('updated ' + user.username);
                        }
                        else{
                            console.log('put');
                            console.log('status: ' + response.statusCode);
                            console.log('error: ' + error);
                            console.log('body: ' + body);
                            return reject();
                        }
                    })
                }

                return resolve();
            });

        });

    });
};

exports.updateGroups = function(user) {

    Membership.getActiveMembershipsByUser(user._id).then(function(memberships){


        Character.findOne({ _id: user.services.jabber.character }, function(err, character){

            var groups = [ character.alliance.name , character.corporation.name ];

            for(var group in memberships){
                if(memberships[group].jabberId) {
                    groups.push(memberships[group].jabberId);
                }
            }

            var options = {
                headers: {
                    'Authorization': config.jabber.secret
                }
            };

            options.url = config.jabber.userEndpoint + '/users/' + user.services.jabber.username + '/groups';
            var data = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
            data += '<groups>';

            for(var x = 0; x < groups.length; x++)
                data += '<groupname>' + groups[x] + '</groupname>';

            data += '</groups>';

            options.body = data;
            options.headers['Content-Type'] =  'text/xml';

            request.post(options, function(error, response, body){
                if (!error && response.statusCode == 201) {
                    console.log('updated groups' + user.services.jabber.username);
                }
                else{
                    console.log('post');
                    console.log('status: ' + response.statusCode);
                    console.log('error: ' + error);
                    console.log('body: ' + body);
                }
            })



        })

    });

};