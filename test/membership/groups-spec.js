var expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../server/services/membership/GroupManager');

var resetGroups = function() {
    return new Promise(function(resolve, reject){
        mongoose.connection.collections['groups'].drop(resolve, reject);
    })
};

var connectDB = function() {
    return new Promise(function(resolve){
        if(mongoose.connection.db) return resolve();

        mongoose.connect('mongodb://localhost/SamuraiAuth_Test', function() {
            resolve();
        });
    });
};

describe("get groups", function(){

    var groups = [];

    before(function(done) {
        connectDB()
            .then(resetGroups)
            .then(Groups.seedGroups)
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

    var members = [];

    before(function(done) {
        connectDB('mongodb://localhost/SamuraiAuth_Test')
            .then(resetGroups)
            .then(function(){

            })
            .then(function(){
                done();
            });
    });

    it('should add the user as a member');
    it('should set the member status to \'Pending\'');
    it('should add the character to the list of characters');
    it('should set the applied date for the character');
    it('should have the approved date as undefined');
    it('should have the approved by as undefined');
});

describe('creating a group', function(){

    before(function(done){
        connectDB()
            .then(resetGroups)
            .then(function(){
                done();
            })
    });

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

    describe('when last character', function() {
        it('should remove the user from the list of members')
    });

    describe('when remaining character(s) have invalid keys', function(){
        it('should set the status to \'Probation\'');
    });

    it('should remove the character from the characters list');


});

