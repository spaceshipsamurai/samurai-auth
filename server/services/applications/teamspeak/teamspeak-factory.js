var TeamspeakClient = require('node-teamspeak'),
    config = require('../../../config/config').getConfig(),
    Promise = require('bluebird');


var state = 'disconnected', client, timeout;

var checkActivity = function() {

    var pending = client.getPending();

    if(pending.length > 0)
    {
        timeout = setTimeout(checkActivity, 10000)
    }
    else if(state === 'connected') {
        client.send("quit");
    }

};

//nodemon kill signal, make sure we quit the ts session
process.once('SIGUSR2', function () {

    if(state === 'connected')
    {
        client.send("quit", function(){
            process.kill(process.pid, 'SIGUSR2');
        });
    }
    else {
        process.kill(process.pid, 'SIGUSR2');
    }

});

var createNewClientInstance = function() {

    return new Promise(function(resolve, reject){

        client = new TeamspeakClient(config.teamspeak.server);

        client.on('connect', function(){
            state='connected';

            if(timeout)
            {
                clearTimeout(timeout);
            }

            timeout = setTimeout(checkActivity, 10000);
        });

        client.on('error', function(err){
            console.log(err);
        });

        client.on('close', function(){

            if(timeout) clearTimeout(timeout);

            state = 'disconnected';
        });

        client.send('login', {
            client_login_name: config.teamspeak.admin.name,
            client_login_password: config.teamspeak.admin.password
        }, function(err){
            if(err.id != 0) return reject(err);

            client.send('use', { sid: 1 }, function(err){
                if(err.id != 0) return reject(err);

                client.send('clientupdate', { client_nickname: 'Samurai Auth' }, function(err){
                    if(err.id != 0) return reject(err);
                    return resolve(client);
                });


            });
        });

    });

};

exports.getClientInstance = function() {

    if(state === 'disconnected') return createNewClientInstance();

    return new Promise(function(resolve){
        return resolve(client);
    });

};

