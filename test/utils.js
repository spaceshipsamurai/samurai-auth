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
            clearDB();
            done();
        });
    }
    else
    {
        clearDB();
        done();
    }


});


after(function(done){
    mongoose.disconnect();
    done();
});

function clearDB() {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].drop();
    }
}

exports.createModel = function(type, model) {

    var Model = mongoose.model(type);

    return new Promise(function(resolve, reject){
        Model.create(model, function(err, savedModel){
            if(err) reject(err);
            resolve(savedModel);
        })
    });
};