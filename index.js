/**
 * Module dependencies.
 */

var configLoader = require('./server/lib/configLoader'),
    util         = require('util'),
    Nongo        = require('./server/nongo'),
    Server       = require('./server/index'),
    Q            = require('q');


Q.longStackSupport = true;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

configLoader.load()
    .then(function (config) {
        return Nongo.init(config);
    })
    .then(function (db) {
        var server = new Server();

        return server.start();
    })
    .then(function () {
        console.log('Nongo listening on port ' + Nongo.config.server.port);
    })
    .fail(function (err) {
        console.log(err);
    });