var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('purging a user from a group', function(){

    it('should remove all the user\'s characters from the group');
    it('should remove any characters the user may have as a manager');
    it('should set owner to undefined if user is owner');

});
