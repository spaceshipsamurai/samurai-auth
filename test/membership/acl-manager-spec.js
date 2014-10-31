var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    acl = require('../../server/services/membership/AclManager')

describe('validating group membership', function() {

    var group = {
        name: 'Test Group',
        createdBy: mongoose.Types.ObjectId(),
        createdDate: new Date(),
        members: [{
            characterId: 1,
            characterName: "Test Character",
            appliedDate: new Date(),
            status: 'Pending'
        },
            {
                characterId: 4,
                characterName: "Test Character2",
                appliedDate: new Date(),
                status: 'Member'
            }]
    }, key;


    before(function(done){
        utils.createModel('Key', {
            userId: mongoose.Types.ObjectId(),
            keyId: '1',
            characters: [{
                id: 1
            },{
                id: 2
            }]
        }).then(function(key) {
            return utils.createModel('Key', {
                userId: key.userId,
                keyId: '2',
                characters: [{
                    id: 4
                },{
                    id: 5
                }]
            })
        }).then(function(savedKey){
            key = savedKey;
            return utils.createModel('Group', group);
        }).then(function(savedGroup){
            group = savedGroup;
            done();
        });
    });

    describe('when user is authorized', function() {
        it('should return result with authorized set to true', function(done) {
            acl.isGroupMember(group._id, key.userId)
                .then(function(result){
                    expect(result).to.exist;
                    expect(result.authorized).to.be.true;
                    done();
                }).catch(function(err){
                    done(err);
                });
        });
    });
});

describe('validating group owner', function() {
    describe('when user is authorized', function(){
        it('should return result with authorized set to true');
    });
});

describe('validating group manager', function() {
    describe('when user is authorized', function(){
        it('should return result with authorized set to true');
    });
});