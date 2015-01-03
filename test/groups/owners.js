var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('setting an owner', function(){

    it('should set the characters status to \'Owner\'');
    it('should set the character as the group\'s owner');

    describe('when the character is a manager', function(){
        it('should remove the character as a manager')
    });

});

describe('removing an owner', function(){

    it('should set the characters status to \'Member\'');
    it('should remove the character as the group\'s owner');

});