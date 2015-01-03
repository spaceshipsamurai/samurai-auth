var Group = require('mongoose').model('Group');

exports.get = function(req, res, next) {

    Group.find({})
        .populate('owner', 'primary')
        .populate('managers', 'primary')
        .populate('owner.primary')
        .exec(function(err, groups){

            if(err) return next({msg: err });

            return res.json(groups);
        });

};

exports.create = function(req, res, next) {

};

exports.update = function(req, res, next) {

};

exports.delete = function(req, res, next) {

};
