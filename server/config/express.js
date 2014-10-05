var express = require('express'),
    stylus = require('stylus'),
    passport = require('passport'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    logger = require('morgan');

module.exports = function (app, config) {

    function compile(str, path) {
        return stylus(str).set('filename', path);
    }


    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');
    app.use(logger());
    app.use(session({ keys: config.sessionKeys }));
    app.use(bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(stylus.middleware({
        src: config.rootPath + '/public',
        compile: compile
    }));

    app.use(express.static(config.rootPath + '/public'));

}
