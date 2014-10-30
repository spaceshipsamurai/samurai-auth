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

        it('should add the user as a member', function(done){
            expect(member.userId).to.eql(user._id);
            done();
        });

        it('should set the member status to \'Pending\'', function(done){
            expect(member.status).to.equal('Pending');
            done();
        });

        it('should add the character to the list of characters', function(done){
            expect(member.characters).to.be.a('array');
            expect(member.characters).to.have.length(1);

            var givenChar = member.characters[0];

            expect(givenChar.characterId).to.equal(1);
            expect(givenChar.characterName).to.equal('Test Char');
            done();
        });

        it('should set the applied date for the character', function(done){
            expect(member.characters).to.be.a('array');
            expect(member.characters).to.have.length(1);

            var givenChar = member.characters[0];

            expect(givenChar.appliedDate).to.exist;
            expect(givenChar.appliedDate).to.be.a('Date');

            var diff = (new Date()).getTime() - givenChar.appliedDate.getTime();

            expect(diff).to.be.below(1000);

            done();
        });

        it('should have the approved date as undefined', function(done){
            expect(member.characters).to.be.a('array');
            expect(member.characters).to.have.length(1);

            var givenChar = member.characters[0];

            expect(givenChar.approvedDate).to.not.exist;

            done();

        });

        it('should have the approved by as undefined', function(done){
            expect(member.characters).to.be.a('array');
            expect(member.characters).to.have.length(1);

            var givenChar = member.characters[0];

            expect(givenChar.approvedBy).to.not.exist;

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

    it('should change the user\'s status to \'Member\'');
    it('should set approved by');
    it('should set approved date');

});

describe('removing a member', function() {
    it('should remove the user from the list of members');
});

describe('removing a character', function(){

    describe('when it is the last character', function() {
        it('should remove the user from the list of members')
    });

    describe('when remaining character(s) have invalid keys', function(){
        it('should set the status to \'Probation\'');
    });

    it('should remove the character from the characters list');


});
