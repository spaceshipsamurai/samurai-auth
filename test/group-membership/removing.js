var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('removing a character from a group', function(){

    describe('when the user has multiple characters', function(){

        var member;

        before(function(done){

            utils.createModel('Member', {
                userId: mongoose.Types.ObjectId(),
                characters: [{
                    id: 1,
                    name: 'Test Character',
                    appliedDate: new Date(),
                    status: 'Member'
                },
                {
                    id: 2,
                    name: 'Test Character 2',
                    appliedDate: new Date(),
                    status: 'Member'
                }],
                group: mongoose.Types.ObjectId()
            }).then(function(savedMember){
                member = savedMember;
                done();
            })

        });

        it('should remove only the given character', function(done){

            Groups.removeCharacter(member.group, 2).then(function(){

                MemberModel.findOne({userId: member.userId, group: member.group }, function(err, savedMember){
                    expect(savedMember.characters).to.be.a('array');
                    expect(savedMember.characters).to.have.length(1);
                    expect(savedMember.characters[0].id).equal(1);
                    done();
                });

            }).catch(function(err){
                done(new Error(err));
            });

        });
    });

    describe('when character is the user\'s last character', function(){

        var member;

        before(function(done){

            utils.createModel('Member', {
                userId: mongoose.Types.ObjectId(),
                characters: [{
                    id: 2,
                    name: 'Test Character 2',
                    appliedDate: new Date(),
                    status: 'Member'
                }],
                group: mongoose.Types.ObjectId()
            }).then(function(savedMember){
                member = savedMember;
                done();
            })

        });

        it('should remove the entire member record', function(done){

            Groups.removeCharacter(member.group, 2).then(function(){

                MemberModel.findOne({userId: member.userId, group: member.group }, function(err, savedMember){
                    expect(savedMember).to.not.exist;
                    done();
                });

            }).catch(function(err){
                done(new Error(err));
            });

        });
    });

    describe('when the character is a manager', function(){
        it('should be removed from the group\'s list of managers');
    });

    describe('when the character is an owner', function(){
        it('should set the owner to undefined');
    });

});
