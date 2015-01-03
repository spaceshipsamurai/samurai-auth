var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    path = require('path');

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

        //promises.push(clear('keys'));
        //promises.push(clear('users'));
        promises.push(clear('groups'));
        promises.push(clear('members'));

        return Promise.all(promises);
    };

    var clear = function(collectionName) {
        return new Promise(function(resolve, reject){

            if(!mongoose.connection.collections[collectionName]) resolve();

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

var src = require(path.join(path.normalize(__dirname + './../'), 'src'));
exports.src =  src;

var clone = function(obj){

    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            temp[key] = clone(obj[key]);
        }
    }

    return temp;

};

exports.clone = clone;