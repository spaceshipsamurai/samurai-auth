var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');


describe('accepting a new character', function(){

    describe('when information is valid', function(){

        var member,
            ownerUserId = mongoose.Types.ObjectId();

        before(function(done){
            utils.collections.clearAll().then(function(){
                utils.createModel('Member', {
                    userId: mongoose.Types.ObjectId(),
                    characters: [{
                        id: 1,
                        name: 'Test Character',
                        appliedDate: new Date(),
                        status: 'Pending'
                    }],
                    group: mongoose.Types.ObjectId()
                }).then(function(savedMember){
                    member = savedMember;

                    return Groups.acceptMember({
                        groupId: member.group,
                        approvedBy: ownerUserId,
                        characterId: 1
                    });
                }).then(function(){
                    MemberModel.findOne({ group: member.group, userId: member.userId }, function(err, updatedMember){
                        member = updatedMember;
                        done();
                    });
                }).catch(function(err){
                    done(new Error(err));
                });
            });
        });

        it('should set approved date', function(done){
            expect(member.characters[0].approvedDate).to.exist;
            expect((new Date()).getTime() - member.characters[0].approvedDate.getTime()).to.be.lt(500);
            done();
        });

        it('should set approved by', function(done){
            expect(member.characters[0].approvedBy).to.exist;
            expect(member.characters[0].approvedBy).to.eql(ownerUserId);
            done();
        });

        it('should set status to accepted', function(done){
            expect(member.characters[0].status).to.exist;
            expect(member.characters[0].status).to.equal('Member');
            done();
        });
    });

    describe('when characterId is a string', function(){

        var member,
            ownerUserId = mongoose.Types.ObjectId();

        before(function(done){
            utils.collections.clearAll().then(function(){
                utils.createModel('Member', {
                    userId: mongoose.Types.ObjectId(),
                    characters: [{
                        id: 1,
                        name: 'Test Character',
                        appliedDate: new Date(),
                        status: 'Pending'
                    }],
                    group: mongoose.Types.ObjectId()
                }).then(function(savedMember){
                    member = savedMember;

                    return Groups.acceptMember({
                        groupId: member.group.toString(),
                        approvedBy: ownerUserId,
                        characterId: "1"
                    });
                }).then(function(){
                    MemberModel.findOne({ group: member.group, userId: member.userId }, function(err, updatedMember){
                        member = updatedMember;
                        done();
                    });
                }).catch(function(err){
                    done(new Error(err));
                });
            });
        });

        it('should set approved date', function(done){
            expect(member.characters[0].approvedDate).to.exist;
            expect((new Date()).getTime() - member.characters[0].approvedDate.getTime()).to.be.lt(500);
            done();
        });

        it('should set approved by', function(done){
            expect(member.characters[0].approvedBy).to.exist;
            expect(member.characters[0].approvedBy).to.eql(ownerUserId);
            done();
        });

        it('should set status to accepted', function(done){
            expect(member.characters[0].status).to.exist;
            expect(member.characters[0].status).to.equal('Member');
            done();
        });

    });


});