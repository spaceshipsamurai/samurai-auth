var Recruit = require('mongoose').model('Recruit'),
    logger = require('../../config/logger'),
    neow = require('neow'),
    Membership = require('../../services/account/membership-service');


exports.add = function(req, res) {

    if(!req.body)
        return res.status(400).json({ message: 'Invalid data'});

    if(!req.user.primary)
        return res.status(400).json({ message: 'User does not have a primary character set'});

    var batch = req.body,
        names = [];

    //Find duplicates
    Recruit.find({  name: { $in: batch.names } }, function(err, recruits){

        if(err)
        {
            logger.log(logger.level.critical, 'Error saving recruits: ' + err, 'recruitment, db');
            return res.status(500).json({ message: 'Internal Server Error'});
        }

        //remove duplicates
        for(var i = 0; i < recruits.length; i++)
        {
            var index = batch.names.indexOf(recruits[i].name);

            if(index != -1)
            {
                batch.names.splice(index, 1);
            }
        }

        console.log(batch.names);

        //add the remaining
        for(var x = 0; x < batch.names.length; x++)
        {
            names.push({
                createdDate: new Date(),
                createdBy: req.user._id,
                corporation: req.user.primary.corporation.id,
                system: batch.location,
                name: batch.names[x]
            });
        }

        Recruit.create(names, function(err){

            if(err)
            {
                logger.log(logger.level.critical, 'Error saving recruits: ' + err + ' Data: ' + JSON.stringify(names), 'recruitment, db');
                return res.status(500).json({ message: 'Internal Server Error'});
            }

            res.status(200).json({ message: 'Success' });
        });

    });

};

exports.list = function(req, res){

    var query = { mailDate: { $exists: false },
        $or: [ {isLocked: false }, { lockUser: req.user._id }, { lockExpires: { $lt: new Date() }}] };

    var q = Recruit.find(query);

    if(req.query.priority)
    {
        if(req.query.priority === 'newer')
        {
            q.sort({createdDate: -1});
        }
        else
        {
            q.sort({createdDate: 1});
        }
    }

    if(req.query.limit)
    {
        q.limit(req.query.limit);
    }

    q.exec(function(err, recruits){
        if(err)
        {
            logger.log(logger.level.critical, 'Error retrieving recruits: ' + err, 'recruitment, db');
            return res.status(500).json({ message: 'Internal Server Error'});
        }

        if(req.query.lock)
        {
            recruits.forEach(function(rc){

                console.log('Locking: ' + rc.name);
                rc.lockExpires = new Date((new Date()).getTime() + 5*60000);
                rc.lockUser = req.user._id;
                rc.isLocked = true;
                rc.save();
            });
        }


        return res.json(recruits);
    });

};

exports.sendMail = function(req, res) {

    var names = req.body.names;

    Recruit.update({ name: {$in: names } },
                    {$set: { mailDate: new Date()}}, { multi: true}, function(err) {

            if(err)
            {
                console.log(err);
            }

        });

    return res.json({ message: 'Success' });

};

exports.authorize = function(req, res, next){

    Membership.getActiveMembershipsByUser(req.user._id).then(function(groups){

        if(groups['Recruiters'])
            next();
        else
            return res.status(401).json({ message: 'You are not authorized for this function'});

    });

};

exports.validate = function(req, res) {

    if(!req.body || !req.body.name) return res.json({});

    Recruit.findOne({ name: req.body.name }, function(err, recruit) {

        if(err) res.status(500).json({ message: 'Internal server error' });
        if(!recruit || recruit.length == 0) return res.json({});

        var eve = new neow.EveClient({});


        eve.fetch('eve:CharacterID', { names: recruit.name }).then(function(result){

            for(var id in result.characters) {

                if(result.characters[id].name === recruit.name)
                {
                    eve.fetch('eve:CharacterInfo', { characterID: id }).then(function(cResult){
                        return res.json(cResult);
                    }).catch(function(err){
                        console.log(err);
                        return res.json({});
                    });
                }
            }

        }).catch(function(err){
            console.log(err);
            return res.json({});
        });


    });

};
