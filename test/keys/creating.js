var util = require('../utils'),
    expect = require('chai').expect,
    eveApiMock = require('../eveApiMock'),
    Keys = require('../../src/index').Keys,
    KeyModel = require('../../src/keys/key-model'),
    mongoose = require('mongoose');

describe('creating a key', function(){

    var keys = {
        valid: {
            accessMask: 268435455,
            type: 'Account',
            characters: {
                1: {
                    characterName: 'Test',
                    corporationID: 1,
                    corporationName: 'Corp',
                    allianceID: 2,
                    allianceName: 'Alliance',
                    characterID: 1
                }
            }
        },
        invalid: {
            accessMask: 1,
            type: 'Character'
        }
    };

    Keys.use(eveApiMock);

    before(function(done){
        util.collections.clear('keys').then(function(){

            eveApiMock.setFetchResult('account:APIKeyInfo', {
                key: keys.valid
            });

            done();
        });
    });

    it('should verify the key id exist', function(done){

        Keys.create({}).then(function(){
            done('Key was created');
        }).catch(function(err){
            expect(err).to.exist;
            done();
        });

    });

    it('should verify the verification code exists', function(done){

        Keys.create({ id: 123 }).then(function(){
            done('Key was created');
        }).catch(function(err){
            expect(err).to.exist;
            done();
        });
    });

    it('should save the key with characters to the database', function(done) {

        var key = util.clone(keys.valid);
        eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

        Keys.create({ id: 123, vCode: 'abcdef', userId: mongoose.Types.ObjectId() }).then(function(newKey){

            KeyModel.findOne({ keyId: 123 }, function(err, savedKey ){
                if(err) return done(new Error(err));
                expect(savedKey).to.exist;
                expect(savedKey.accessMask).to.eql(key.accessMask);
                expect(savedKey.keyType).to.eql(key.type);
                expect(savedKey.expires).to.not.exist;
                expect(savedKey.status).to.eql('Valid');
                expect(savedKey.characters).to.exist;
                expect(savedKey.characters).to.be.a('array');
                expect(savedKey.characters).to.have.length(1);
                expect(savedKey.characters[0].name).to.equal('Test');
                expect(savedKey.characters[0].corporation.name).to.equal('Corp');
                expect(savedKey.characters[0].corporation.id).to.equal(1);
                expect(savedKey.characters[0].alliance.name).to.equal('Alliance');
                expect(savedKey.characters[0].alliance.id).to.equal(2);
                expect(savedKey.characters[0].id).to.equal(1);
                done();
            });
        }).catch(function(err){
            done(new Error(err));
        });

    });

    describe('verifying the access mask', function(){

        it('should allow a full access mask', function(done){

            eveApiMock.setFetchResult('account:APIKeyInfo', { key: keys.valid });

            Keys.create({ id: 123, vCode: 'abcdef' }).then(function(){
                done();
            }).catch(function(err){
                done(err);
            });

        });

        it('should reject invalid access mask', function(done){

            var key = util.clone(keys.valid);
            key.accessMask = 1;
            eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

            Keys.create({ id: 123, vCode: 'abcdef' }).then(function(){
                done('Key was created');
            }).catch(function(err){

                expect(err).to.exist;
                expect(err).to.eql('Invalid access mask');

                KeyModel.findOne({ id: 123 }, function(e, savedKey){
                    expect(savedKey).to.not.exist;
                    done();
                });

            }).catch(function(err){
                done(err);
            });

        });

        it('should accept keys missing only market info', function(done){

            var key = util.clone(keys.valid);
            key.accessMask = 264237054;
            eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

            Keys.create({ id: 123, vCode: 'abcdef' }).then(function(){
                done();
            }).catch(function(err){
                done( new Error(err) )
            });

        });

        it('should reject keys missing walletjournal', function(done){

            var key = util.clone(keys.valid);
            key.accessMask = 266338303;
            eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

            Keys.create({ id: 123, vCode: 'abcdef' }).then(function(){
                done(new Error('Key Accepted'));
            }).catch(function(err){
                expect(err).to.exist;
                expect(err).to.eql('Invalid access mask');
                done();
            }).catch(function(err){
                done(err);
            });

        });

    });

    it('should verify that it is an account key', function(done){

        var key = util.clone(keys.valid);
        key.type = 'Character';
        eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

        Keys.create({ id: 123, vCode: 'abcdef' }).then(function(){
            done(new Error('Key was created'));
        }).catch(function(err){
            expect(err).to.exist;
            expect(err).to.eql('Invalid key type');
            done();
        }).catch(function(err){
            done(new Error(err));
        });

    });

    it('should set the status to valid', function(done){

        var key = util.clone(keys.valid);
        eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

        Keys.create({ id: 1234, vCode: 'abcdef', userId: mongoose.Types.ObjectId() }).then(function(newKey){

            KeyModel.findOne({ keyId: 1234 }, function(err, savedKey ){
                if(err) return done(new Error(err));
                expect(savedKey).to.exist;
                expect(savedKey.status).to.eql('Valid');
                done();
            });
        }).catch(function(err){
            done(new Error(err));
        });

    });

    it('should set the last check date', function(done){

        var key = util.clone(keys.valid);
        eveApiMock.setFetchResult('account:APIKeyInfo', { key: key });

        Keys.create({ id: 1234, vCode: 'abcdef', userId: mongoose.Types.ObjectId() }).then(function(newKey){

            KeyModel.findOne({ keyId: 1234 }, function(err, savedKey ){
                if(err) return done(new Error(err));
                expect(savedKey).to.exist;
                expect(savedKey.lastCheck).to.exist;
                var diff = (new Date()).getTime() - savedKey.lastCheck.getTime();
                expect(diff).to.be.below(500);
                done();
            });
        }).catch(function(err){
            done(new Error(err));
        });

    });



});
