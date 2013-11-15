/**
 * Module dependencies.
 */

var express     = require('express'),
    middlewares = require('./lib/middlewares'),
    Nongo       = require('./nongo'),
    database    = require('./routes/database'),
    collection  = require('./routes/collection'),
    document  = require('./routes/document'),
    Q           = require('q'),
    path        = require('path'),
    Server;

Server = function () {
    var app = express();


    app.set('views', __dirname + '/views');
    app.set('view engine', 'hbs');
    app.use(express.json());
    app.use(express.urlencoded());

    app.use(middlewares.validator());

    // Logging configuration
    if (Nongo.NODE_ENV === 'development') {
        app.use(express.logger('dev'));
    } else if (Nongo.NODE_ENV !== 'testing') {
        app.use(express.logger());
    }


    app.use(middlewares.singlePage);
    app.use(app.router); // Map routes

    // return the correct mime type for woff filess
    //express['static'].mime.define({'application/font-woff': ['woff']});


    // express.static.mime.define({'application/x-font-woff': ['woff']});
    // express.static.mime.define({'application/x-font-ttf': ['ttf']});
    // express.static.mime.define({'application/vnd.ms-fontobject': ['eot']});
    // express.static.mime.define({'font/opentype': ['otf']});


    app.use(express.static(path.join(__dirname, '/../public')));

    app.use(middlewares.errorHandling);
    app.use(express.errorHandler());

    app.get('/favicon.ico', function (req, res, next) { return res.send(404); });   // No favicon

    app.param('database', middlewares.connectToDatabase);

    app.get('/api/db', database.list);
    app.post('/api/db', database.create);
    app.delete('/api/db/:database', database.drop);


    app.get('/api/db/:database/collections', collection.list);
    app.post('/api/db/:database/collections', collection.create);
    app.delete('/api/db/:database/collections/:collection', collection.drop);


    app.get('/api/db/:database/collections/:collection/documents', document.list);
    app.put('/api/db/:database/collections/:collection/documents/:id', document.update);

    this.app = app;

    return this;
};

Server.prototype.start = function () {

    var deferred = Q.defer();

    this.httpServer = this.app.listen(Nongo.config.server.port, Nongo.config.server.hostname, function () {
        deferred.resolve();
    });

    return deferred.promise;
};

Server.prototype.close = function () {
    this.httpServer.close();
};

// exports
module.exports = Server;