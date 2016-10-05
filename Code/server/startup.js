import path from 'path';
import Express from 'express';
import Container from './config/container';
import warn from '../lib/logger';

/**
 * @param {int} port
 * @returns {http.Server}
 */
export default function startup(port) {
    var app = new Express();

    app.set('port', port);

    return configureDb(app)
        .then(configureDIContainer)
        .then(configureWebSocket)
        .then(configureTemplateEngine)
        .then(configureMiddleware)
        .then(configureErrorHandling)
        .then(app => {
            // create http server
            var server = app.listen(port);

            // attach http server to io
            app.locals.io.listen(server);

            return server;
        });
}

function configureDIContainer(app) {
    app.locals.container = new Container(app);
    return app;
}

function configureDb(app) {
    var MongoClient = require('mongodb').MongoClient;

    return MongoClient
        .connect('mongodb://localhost:27017/myproject')
        .then(db => {
            app.locals.db = db;
            return app;
        }).catch(warn);
}

function configureWebSocket(app) {
    let io = require('socket.io');
    app.locals.io = io();
    return app;
}

function configureTemplateEngine(app) {
    // view engine setup
    /*app.set('views', path.join(__dirname, 'views'));
     app.set('view engine', 'jade');*/
    return app;
}

function configureMiddleware(app) {
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(Express.static(path.join(__dirname, '../client')));

    return configureRoutes(app);
}

function configureRoutes(app) {
    let routes = require('./routes').default;
    routes(app);
    return app;
}

function configureErrorHandling(app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            console.log(err);
            res.status(err.status || 500);
            res.json(err);
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({message: err.message});
    });

    return app;
}