// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'testing';

var mongoose = require('mongoose'),
    config = require('../server/config/config')[process.env.NODE_ENV];

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