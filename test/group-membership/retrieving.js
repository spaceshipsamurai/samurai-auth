var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('getting memberships by userId', function(){

    var userId = mongoose.Types.ObjectId();
    var inactiveUserId = mongoose.Types.ObjectId();

    var group = {
        name: 'Test Group',
        createdDate: new Date(),
        createdBy: mongoose.Types.ObjectId()
    },
    member = {
        userId: userId,
        characters: [{
            id: 1,
            name: 'Test Character',
            approvedDate: new Date(),
            approvedBy: mongoose.Types.ObjectId(),
            appliedDate: new Date(),
            status: 'Member'
        },{
            id: 2,
            name: 'Test Character 2',
            approvedDate: new Date(),
            approvedBy: mongoose.Types.ObjectId(),
            appliedDate: new Date(),
            status: 'Inactive'
        }]
    }, allInactiveMember = {
        userId: inactiveUserId,
        characters: [{
            id: 1,
            name: 'Test Character',
            approvedDate: new Date(),
            approvedBy: mongoose.Types.ObjectId(),
            appliedDate: new Date(),
            status: 'Inactive'
        }]
    }, groups;

    before(function(done){

        utils.collections.clearAll().then(function(){

            utils.createModel('Group', group).then(function(savedGroup){
                group = savedGroup;
                member.group = group._id;
                allInactiveMember.group = group._id;

                var promises = [
                    utils.createModel('Member', member).then(function(savedMember){
                        member = savedMember;
                    }),
                    utils.createModel('Member', allInactiveMember).then(function(savedMember){
                        allInactiveMember = savedMember;
                    })
                ];

                return Promise.all(promises);
            }).then(function(){
                Groups.getByUserId(userId).then(function(g){
                    groups = g;
                    done();
                }).catch(function(err){
                    done(new Error(err));
                });
            }).catch(function(err){
                done(new Error(err));
            });

        });
    });


    it('should return an object containing the users groups', function(done){
            expect(groups).to.exist;
            expect(groups['Test Group']).to.exist;
            expect(groups['Test Group']._id).to.eql(group._id);
            done();
    });

    describe('for each group', function(){

        it('should have list of characters and their status', function(done){

            expect(groups['Test Group'].characters).to.exist;
            expect(groups['Test Group'].characters).to.be.a('array');
            expect(groups['Test Group'].characters).to.have.length(2);
            expect(groups['Test Group'].characters[0].id).to.equal(1);
            done();
        });

        describe('when highest status is inactive', function(){

            var inactiveGroups;

            before(function(done){
                Groups.getByUserId(inactiveUserId).then(function(g){
                    inactiveGroups = g;
                    done();
                }).catch(function(err){
                    done(new Error(err));
                });
            });

            it('should have a memberStatus of inactive', function(done){
                expect(inactiveGroups['Test Group'].memberStatus).to.exist;
                expect(inactiveGroups['Test Group'].memberStatus).to.equal('Inactive');
                done();
            });
        });

        describe('when highest status is pending', function(){

            var pendingMember, pendingGroup;

            before(function(done){
                utils.createModel('Member',{
                    userId: mongoose.Types.ObjectId(),
                    group: group._id,
                    characters: [{
                        id: 1,
                        name: 'Test Character',
                        approvedDate: new Date(),
                        approvedBy: mongoose.Types.ObjectId(),
                        appliedDate: new Date(),
                        status: 'Inactive'
                    }, {
                        id: 1,
                        name: 'Test Character',
                        approvedDate: new Date(),
                        approvedBy: mongoose.Types.ObjectId(),
                        appliedDate: new Date(),
                        status: 'Pending'
                    }]
                }).then(function(savedMember){
                    pendingMember = savedMember;

                    Groups.getByUserId(pendingMember.userId).then(function(groups){
                        pendingGroup = groups['Test Group'];
                        done();
                    });
                });

            });

            it('should have a memberStatus of pending', function(done){
                expect(pendingGroup).to.exist;
                expect(pendingGroup.memberStatus).to.exist;
                expect(pendingGroup.memberStatus).to.equal('Pending');
                done();
            });
        });

        describe('when at least one characters is accepted', function(){

            var activeMember, activeGroup;

            before(function(done){
                utils.createModel('Member',{
                    userId: mongoose.Types.ObjectId(),
                    group: group._id,
                    characters: [{
                        id: 1,
                        name: 'Test Character',
                        approvedDate: new Date(),
                        approvedBy: mongoose.Types.ObjectId(),
                        appliedDate: new Date(),
                        status: 'Inactive'
                    }, {
                        id: 1,
                        name: 'Test Character',
                        approvedDate: new Date(),
                        approvedBy: mongoose.Types.ObjectId(),
                        appliedDate: new Date(),
                        status: 'Pending'
                    }, {
                        id: 1,
                        name: 'Test Character',
                        approvedDate: new Date(),
                        approvedBy: mongoose.Types.ObjectId(),
                        appliedDate: new Date(),
                        status: 'Member'
                    }]
                }).then(function(savedMember){
                    activeMember = savedMember;

                    Groups.getByUserId(activeMember.userId).then(function(groups){
                        activeGroup = groups['Test Group'];
                        done();
                    });
                });
            });

            it('should have a memberStatus of Member', function(done){
                expect(activeGroup).to.exist;
                expect(activeGroup.memberStatus).to.exist;
                expect(activeGroup.memberStatus).to.equal('Member');
                done();
            });
        });

        describe('when user is a group owner', function(){

            var group = {
                name: 'Test Group 2',
                createdDate: new Date(),
                createdBy: mongoose.Types.ObjectId(),
                owner: {
                    id: 1,
                    name: 'Test Character'
                },
                managers: [{
                    id: 1,
                    name: 'Test Character'
                }]
            }, member = {
                userId: mongoose.Types.ObjectId(),
                characters: [{
                    id: 1,
                    name: 'Test Character',
                    approvedDate: new Date(),
                    approvedBy: mongoose.Types.ObjectId(),
                    appliedDate: new Date(),
                    status: 'Member'
                },{
                    id: 2,
                    name: 'Test Character 2',
                    approvedDate: new Date(),
                    approvedBy: mongoose.Types.ObjectId(),
                    appliedDate: new Date(),
                    status: 'Inactive'
                }]
            }, groups;

            before(function(done){
                utils.createModel('Group', group).then(function(g){
                    group = g;
                    member.group = g._id;
                    return utils.createModel('Member', member);
                }).then(function(m){
                    member = m;
                    Groups.getByUserId(member.userId).then(function(testGroups){
                        groups = testGroups;
                        done();
                    });
                });
            });

            it('should have a memberStatus of \'Owner\'', function(done){
                var group = groups['Test Group 2'];

                expect(group).to.exist;
                expect(group.memberStatus).to.exist;
                expect(group.memberStatus).to.equal('Owner');
                done();
            });
        });

        describe('when user is a group manager', function(){

            var group = {
                name: 'Test Group 2',
                createdDate: new Date(),
                createdBy: mongoose.Types.ObjectId(),
                owner: {
                    id: 2,
                    name: 'Test Character'
                },
                managers: [{
                    id: 1,
                    name: 'Test Character'
                }]
            }, member = {
                userId: mongoose.Types.ObjectId(),
                characters: [{
                    id: 1,
                    name: 'Test Character',
                    approvedDate: new Date(),
                    approvedBy: mongoose.Types.ObjectId(),
                    appliedDate: new Date(),
                    status: 'Member'
                },{
                    id: 2,
                    name: 'Test Character 2',
                    approvedDate: new Date(),
                    approvedBy: mongoose.Types.ObjectId(),
                    appliedDate: new Date(),
                    status: 'Inactive'
                }]
            }, groups;

            before(function(done){
                utils.createModel('Group', group).then(function(g){
                    group = g;
                    member.group = g._id;
                    return utils.createModel('Member', member);
                }).then(function(m){
                    member = m;
                    Groups.getByUserId(member.userId).then(function(testGroups){
                        groups = testGroups;
                        done();
                    });
                });
            });

            it('should have a memberStatus of \'Manager\'', function(done){
                var group = groups['Test Group 2'];

                expect(group).to.exist;
                expect(group.memberStatus).to.exist;
                expect(group.memberStatus).to.equal('Manager');
                done();

            });
        });

    });
});

describe('getting members by group id', function(){

    var group = {
            name: 'Test Group',
            createdDate: new Date(),
            createdBy: mongoose.Types.ObjectId()
        },
        member = {
            userId: mongoose.Types.ObjectId(),
            characters: [{
                id: 1,
                name: 'Test Character',
                approvedDate: new Date(),
                approvedBy: mongoose.Types.ObjectId(),
                appliedDate: new Date(),
                status: 'Member'
            },{
                id: 2,
                name: 'Test Character 2',
                approvedDate: new Date(),
                approvedBy: mongoose.Types.ObjectId(),
                appliedDate: new Date(),
                status: 'Inactive'
            }]
        };

    before(function(done) {
        utils.createModel('Group', group).then(function(newGroup){

            group = newGroup;
            member.group = group._id;
            utils.createModel('Member', member).then(function(newMember){
                member = newMember;
                done();
            })

        });
    });

    it('should return a list of members', function(done){
        Groups.getMembersByGroup(group._id).then(function(members){
            expect(members).to.exist;
            expect(members).to.be.a('array');
            expect(members).to.have.length(1);
            done();
        });
    });


});
