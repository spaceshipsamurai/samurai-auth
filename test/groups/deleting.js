var utils = require('../utils'),
    expect = require('chai').expect,
    Groups = require('../../src/index').Groups,
    GroupModel = require('../../src/group-management/group-model'),
    MemberModel = require('../../src/group-management/member-model'),
    mongoose = require('mongoose'),
    Promise = require('bluebird');

describe('deleting a group', function(){

    var existingGroup = {
        name: 'Test Group',
        createdBy: mongoose.Types.ObjectId(),
        createdDate: new Date()
    };

    var existingMembers = [{
        groupId: '',
        userId: mongoose.Types.ObjectId(),
        characters: [{
            id: 1,
            name: 'Bob',
            approvedDate: new Date(),
            approvedBy: mongoose.Types.ObjectId(),
            appliedDate: new Date(),
            status: 'Member'
        }]
    }, {
        groupId: mongoose.Types.ObjectId(),
        userId: mongoose.Types.ObjectId(),
        characters: [{
            id: 1,
            name: 'Bob',
            approvedDate: new Date(),
            approvedBy: mongoose.Types.ObjectId(),
            appliedDate: new Date(),
            status: 'Member'
        }]
    }];

    before(function(done){

        utils.collections.clearAll().then(function(){
            return utils.createModel('Group', existingGroup);
        }).then(function(group){
            existingGroup = group;
            existingMembers[0].group = existingGroup._id;

            var promises = [];

            promises.push(utils.createModel('Member', existingMembers[0]));
            promises.push(utils.createModel('Member', existingMembers[1]));

            return Promise.all(promises);
        }).then(function(){
            done();
        });

    });

    it('should remove the group from Groups', function(done){

        Groups.remove(existingGroup._id).then(function(){

            GroupModel.findOne({_id: existingGroup._id}, function(err, group){
                if(err) done(err);
                expect(group).to.not.exist;
                done();
            });

        });

    });
    it('should remove all group records from Members', function(done){

        MemberModel.find({}, function(err, members){

            expect(members).to.be.a('array');
            expect(members).to.have.length(1);
            expect(members[0].group).to.eql(existingMembers[1].group);
            done();
        });

    });

});