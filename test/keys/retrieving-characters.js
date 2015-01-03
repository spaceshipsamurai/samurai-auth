var util = require('../utils'),
    expect = require('chai').expect,
    eveApiMock = require('../eveApiMock'),
    Keys = require('../../src/index').Keys,
    mongoose = require('mongoose'),
    Promise = require('bluebird');

describe('retrieving characters by userId', function(){

    Keys.use(eveApiMock);

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
        }, {
            name: 'Test Character 1.2',
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
    },
    {
        userId: userId,
        keyId: 2,
        vCode: '',
        accessMask: 123,
        keyType: 'Account',
        status: 'Valid',
        characters: [{
            name: 'Test Character 2',
            corporation: {
                id: 1,
                name: 'Test Corporation 2'
            },
            alliance: {
                id: 2,
                name: 'Test Alliance'
            },
            id: 1
        }]
    },
    {
        userId: userId,
        keyId: 3,
        vCode: '',
        accessMask: 123,
        keyType: 'Account',
        status: 'Expired',
        characters: [{
            name: 'Test Character 3',
            corporation: {
                id: 1,
                name: 'Test Corporation 3'
            },
            alliance: {
                id: 2,
                name: 'Test Alliance'
            },
            id: 1
        }]
    }];

    before(function(done){

        var promises = [];

        for(var x = 0; x < keys.length; x++)
        {
            promises.push(util.createModel('Key', keys[x]));
        }

        Promise.all(promises).then(function(){
            done();
        });

    });

    it('should return an object hash of characters from all keys', function(done){
        Keys.getCharacters({ userId: userId, validOnly: false }).then(function(characters){
            expect(characters).to.exist;
            expect(characters).to.be.a('array');
            expect(characters).to.have.length(4);

            done();

        }).catch(function(err){
            done(new Error(err));
        });
    });

    var validOnlyTest = function(done){
        Keys.getCharacters({ userId: userId, validOnly: true }).then(function(characters){
            expect(characters).to.exist;
            expect(characters).to.be.a('array');
            expect(characters).to.have.length(3);

            done();

        }).catch(function(err){
            done(new Error(err));
        });
    };

    it('should default validOnly to true', validOnlyTest);

    describe('when validOnly is true', function(){
        it('should return an object hash containing only characters from a valid key', validOnlyTest);
    });

});
