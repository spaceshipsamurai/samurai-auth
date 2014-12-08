var express = require('express'),
    stylus = require('stylus'),
    passport = require('passport'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    eLogger = require('morgan'),
    logger = require('./logger'),
    path = require('path');

module.exports = function (app, config) {

    function compile(str, path) {
        return stylus(str).set('filename', path);
    }


    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');
    app.use(session({ keys: config.sessionKeys }));
    app.use(bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(stylus.middleware({
        src: path.join(config.rootPath, 'public'),
        compile: compile
    }));


    if(process.env.NODE_ENV === 'development')
    {
        app.use(eLogger());
    }

    app.use(express.static(path.join(config.rootPath, 'public')));

    //error handling
    app.use(function(err, req, res, next){
        logger.log(logger.level.critical, err.msg, err.tags);
        res.status(500).json({ message: 'Internal Server Error' });
    });
};
