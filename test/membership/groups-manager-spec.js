var util = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../server/services/membership/GroupManager'),
    GroupModel = mongoose.model('Group');

describe("get groups", function(){

    var groups = [];

    before(function(done) {
            Groups.seedGroups()
            .then(Groups.find)
            .then(function(collection){
                groups = collection;
                done();
            });
    });

    it("should always contain the admin group", function() {
        expect(groups).to.have.length(1);
    });

});

describe('applying to group', function(){

    var user = {
        _id: mongoose.Types.ObjectId()
    };

    var group = {
        name: 'Test Group',
        createdBy: mongoose.Types.ObjectId(),
        createdDate: new Date()
    };

    var character, application, member;


    describe('with a valid application', function(){

        before(function(done){

            var newGroup = new GroupModel(group);
            newGroup.save(function(err, savedGroup){

                group = savedGroup.toObject();
                application = {
                    groupId: savedGroup._id,
                    userId: user._id,
                    character: {
                        id: 1,
                        name: 'Test Char'
                    }
                };

                character = application.character;

                Groups.submitApplication(application)
                    .then(function(){
                        GroupModel.findOne({ _id: group._id }, function(err, testGroup) {
                            group = testGroup;

                            expect(group.members).to.be.a('array');
                            expect(group.members).to.have.length(1);
                            member = group.members[0];

                            done();
                        });
                    });
            });

        });

        it('should add the character as a member', function(done){
            expect(member.characterId).to.eql(character.id);
            done();
        });

        it('should set the member status to \'Pending\'', function(done){
            expect(member.status).to.equal('Pending');
            done();
        });

        it('should set the applied date for the character', function(done){
            expect(member.appliedDate).to.exist;
            expect(member.appliedDate).to.be.a('Date');
            var diff = (new Date()).getTime() - member.appliedDate.getTime();
            expect(diff).to.be.below(1000);
            done();
        });

        it('should have the approved date as undefined', function(done){
            expect(member.approvedDate).to.not.exist;
            done();
        });

        it('should have the approved by as undefined', function(done){
            expect(member.approvedBy).to.not.exist;
            done();
        });

    });

});

describe('creating a group', function(){

    it('should validate that the group name is not null', function(done){
        Groups.create({})
            .error(function(details){
                expect(details).to.have.deep.property('name.message', 'Group Name is required');
                done();
            });
    });

    it('should validate that created by is not null', function(done){
        Groups.create({})
            .error(function(err){
                expect(err).to.have.deep.property('createdBy.message', 'Created By is required');
                done();
            })
    });

    it('should validate that created date is not null', function(done){
        Groups.create({})
            .error(function(err){
                expect(err).to.have.deep.property('createdDate.message', 'Created Date is required');
                done();
            })
    });

    it('should be written to the db', function(done){

        var date = new Date();
        var testGroup = {
            name: 'Test Group',
            createdBy: mongoose.Types.ObjectId(),
            createdDate: date
        };

        Groups.create(testGroup).then(function(group) {
            return Groups.find({_id: group._id });
        }).then(function(groups){

            var group = groups[0];

            expect(group).to.have.property('name', testGroup.name);
            expect(group.createdBy.toString()).to.equal(testGroup.createdBy.toString());
            expect(group.createdDate).to.eql(testGroup.createdDate);
            done();
        });
    });

});

describe('accepting a member', function() {

    var group = {
            name: 'Test Group',
            createdBy: mongoose.Types.ObjectId(),
            createdDate: new Date(),
            members: [{
                characterId: 1,
                characterName: "Test Character",
                appliedDate: new Date(),
                status: 'Pending'
            }]
    }, approval, member;

    before(function(done){
        var newGroup = new GroupModel(group);
        newGroup.save(function(err, savedGroup){

            group = savedGroup.toObject();
            approval = {
                groupId: group._id,
                characterId: 1,
                characterName: 'Test Character',
                approvedBy: mongoose.Types.ObjectId()
            };

            Groups.approveMember(approval).then(function(){

                GroupModel.findOne({ _id: group._id }, function(err, testGroup) {
                    member = testGroup.members[0];
                    done();
                });

            });
        });
    });

    it('should change the user\'s status to \'Member\'', function(done){
        expect(member.status).to.equal('Member');
        done();
    });

    it('should set approved by', function(done) {

        expect(member.approvedBy).to.exist;
        expect(member.approvedBy).to.eql(approval.approvedBy);
        done();

    });

    it('should set approved date', function(done){
        expect(member.approvedDate).to.exist;
        var diff = (new Date()).getTime() - member.approvedDate.getTime();
        expect(diff).to.be.below(500)
        done();
    });

});

describe('removing a character', function(){

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
            characterId: 2,
            characterName: "Test Character2",
            appliedDate: new Date(),
            status: 'Pending'
        }]
    };

    before(function(done){
        var newGroup = new GroupModel(group);
        newGroup.save(function(err, savedGroup){
            group = savedGroup.toObject();
            Groups.removeMember(group._id, 1)
                .then(function(){
                    GroupModel.findOne({_id: group._id}, function(err, updatedGroup){
                        group = updatedGroup;
                        done();
                    });
                });
        });
    });

    it('should remove only the specified character from the members list', function(done) {
        expect(group.members).to.have.length(1);
        expect(group.members[0]).to.not.equal(1);
        done();
    });


});
