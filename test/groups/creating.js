var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    GroupModel = require('../../src/group-management/group-model');

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
            GroupModel.findOne({_id: group._id }, function(err, group){
                expect(group).to.have.property('name', testGroup.name);
                expect(group.createdBy.toString()).to.equal(testGroup.createdBy.toString());
                expect(group.createdDate).to.eql(testGroup.createdDate);
                done();
            });
        })

    });

});