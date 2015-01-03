var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('applying to a group', function(){

    var group;

    before(function(done){

        utils.collections.clearAll().then(function(){
            return utils.createModel('Group', {
                name: 'Test Group',
                createdBy: mongoose.Types.ObjectId(),
                createdDate: new Date()
            });
        }).then(function(newGroup){
            group = newGroup;
            done();
        })

    });

    it('should create a member record with \'Pending\' status', function(done){

        var userId = mongoose.Types.ObjectId();
        
        Groups.apply(group._id, {
            userId: userId,
            character: {
                id: 1,
                name: 'Test Character'
            }
        }).then(function(){

            MemberModel.find({}, function(err, members){

                if(err) done(err);

                expect(members).to.be.a('array');
                expect(members).to.have.length(1);
                expect(members[0].characters).to.be.a('array');
                expect(members[0].characters).to.have.length(1);
                expect(members[0].characters[0].status).to.eql('Pending');
                expect(members[0].group).to.eql(group._id);
                done();
            });

        }).catch(function(err){
            done(new Error(err));
        })
    });

    it('should set the applied date', function(done){
        var userId = mongoose.Types.ObjectId();

        Groups.apply(group._id, {
            userId: userId,
            character: {
                id: 1,
                name: 'Test Character'
            }
        }).then(function(){

            MemberModel.find({ userId: userId }, function(err, members){

                if(err) done(err);

                expect(members).to.be.a('array');
                expect(members).to.have.length(1);
                expect(members[0].characters).to.be.a('array');
                expect(members[0].characters).to.have.length(1);
                expect(members[0].characters[0].appliedDate).to.exist;

                var diff = (new Date()).getTime() - members[0].characters[0].appliedDate.getTime();

                expect(diff).to.be.below(500);

                done();
            });

        }).catch(function(err){
            done(err);
        })
    });

    describe('when the character belongs to an invalid key', function(){
        it('should return an error');
    });

    describe('when the group doesn\'t exist', function(){
        it('should return an error if the group doesn\'t exist');
    });

    describe('when the user is already a member', function(){

        var group,
            userId = mongoose.Types.ObjectId();

        before(function(done){

            utils.collections.clearAll().then(function(){
                return utils.createModel('Group', {
                    name: 'Test Group',
                    createdBy: mongoose.Types.ObjectId(),
                    createdDate: new Date()
                });
            }).then(function(newGroup){
                group = newGroup;

                utils.createModel('Member', {
                    userId: userId,
                    group: group._id,
                    characters: [{
                        id: 1,
                        name: 'Test Character'
                    }]
                }).then(function(){
                    done();
                });
            })

        });

        it('should return an error if it\'s the same character');
        it('should add the new character as pending', function(done){

            Groups.apply(group._id, {
                userId: userId,
                character: {
                    id: 2,
                    name: 'Test Character 2'
                }
            }).then(function(){
                MemberModel.find({ userId: userId }, function(err, members){

                    if(err) done(err);

                    expect(members).to.be.a('array');
                    expect(members).to.have.length(1);
                    expect(members[0].characters).to.be.a('array');
                    expect(members[0].characters).to.have.length(2);
                    expect(members[0].characters[1].name).to.equal('Test Character 2');

                    done();
                });
            }).catch(function(err){
                done(new Error(err));
            });

        });

    });

});