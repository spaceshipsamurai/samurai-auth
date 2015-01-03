var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    GroupModel = require('../../src/group-management/group-model');

describe('getting groups', function(){

    var expectedGroups;

    before(function(done){

        Promise.all([utils.createModel('Group', {
            name: '1',
            createdBy: mongoose.Types.ObjectId(),
            createdDate: new Date()
        }), utils.createModel('Group', {
            name: '2',
            createdBy: mongoose.Types.ObjectId(),
            createdDate: new Date()
        })]).then(function(group1, group2){
            expectedGroups = [ group1, group2 ];
            done();
        }).catch(function(err){
            done(new Error(err));
        });

    });

    it('should return all groups', function(done){
        Groups.getAllGroups().then(function(groups){

            expect(groups).to.exist;
            expect(groups).to.be.a('array');
            expect(groups).to.have.length(2);
            expect(groups[0].name).to.equal('1');
            done();

        });
    });

});