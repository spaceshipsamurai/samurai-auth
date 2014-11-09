// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'testing';

require('../server/models/Group');
require('../server/models/Key');
require('../server/models/User');

var mongoose = require('mongoose'),
    config = require('../server/config/config')[process.env.NODE_ENV],
    Promise = require('bluebird');

before(function(done){

    if(mongoose.connection.readyState === 0)
    {
        mongoose.connect('mongodb://localhost/SamuraiAuth_Test', function(){
            mongoose.connection.db.dropDatabase(function(){
                collections.clearAll().then(function(){
                    done()
                });
            });
        });
    }
    else
    {
        mongoose.connection.db.dropDatabase(function(){
            collections.clearAll().then(function(){
                done()
            });
        });
    }


});


after(function(done){
    mongoose.disconnect();
    done();
});

var collections = function(){

    var clearAll = function() {
        var promises = [];

        promises.push(clear('keys'));
        promises.push(clear('users'));
        promises.push(clear('groups'));

        return Promise.all(promises);
    };

    var clear = function(collectionName) {
        return new Promise(function(resolve, reject){
            mongoose.connection.collections[collectionName].drop(resolve, reject);
        });
    };

    return {
        clearAll: clearAll,
        clear: clear
    };

}();


exports.collections = collections;

exports.createModel = function(type, model) {

    var Model = mongoose.model(type);

    return new Promise(function(resolve, reject){
        Model.create(model, function(err, savedModel){
            if(err) reject(err);
            resolve(savedModel);
        })
    });
};