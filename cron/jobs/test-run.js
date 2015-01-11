/**
 * cron test script
 */

var Promise = require('bluebird');

exports.run = function() {

    return new Promise(function(resolve, reject){

        console.log('Test Run');
        return resolve({ info: 'Arbitrary Data'});

    });

};