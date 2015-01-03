var utils = require('../utils'),
    expect = require('chai').expect,
    Keys = require('../../src/index').Keys,
    KeyModel = require('../../src/keys/key-model'),
    mongoose = require('mongoose'),
    Promise = require('bluebird');

describe('retrieving keys by user id', function(){

    var userId = mongoose.Types.ObjectId();

    var keys = [{
        userId: userId,
        keyId: 1,
        vCode: '',
        accessMask: 123,
        keyType: 'Account',
        status: 'Valid',
        characters: [{
            name: 'Test Character',
            corporation: {
                id: 1,
                name: 'Test Corporation'
            },
            alliance: {
                id: 2,
                name: 'Test Alliance'
            },
            id: 1
        }]
    }, {
        userId: userId,
        keyId: 2,
        vCode: '',
        accessMask: 123,
        keyType: 'Account',
        status: 'Valid',
        characters: [{
            name: 'Test Character',
            corporation: {
                id: 1,
                name: 'Test Corporation'
            },
            alliance: {
                id: 2,
                name: 'Test Alliance'
            },
            id: 1
        }]
    }], actualKeys;

    before(function(done){
        utils.collections.clearAll().then(function(){
            return Promise.all([utils.createModel('Key', keys[0]), utils.createModel('Key', keys[1])]);
        }).then(function(){
            return Keys.getByUserId(userId).then(function(keys){
                actualKeys = keys;
                done();
            });
        }).catch(function(err){
            done(new Error(err));
        });
    });

    it('should return all keys', function(done){
        expect(actualKeys).to.exist;
        expect(actualKeys).to.be.a('array');
        expect(actualKeys).to.have.length(2);
        done();
    });

});