// Module dependencies
var Mongo          = require('./lib/mongo'),
    NongoError     = require('./errors/nongoError'),
    url            = require('url'),
    Nongo;

Nongo = function () {
    // Expose custom error
    this.Error = NongoError;

    return this;
};

// Initialise the application
Nongo.prototype.init = function (config) {
    this.config = config;
    this.NODE_ENV = process.env.NODE_ENV;
    this.apiUrl = url.format({
        protocol: 'http',
        hostname: config.server.hostname,
        port: config.server.port,
        pathname: '/api/'
    });

    this.mongo = new Mongo(this.config.db);

    return this.mongo.connect();
};


/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
Nongo.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
Nongo.getInstance = function () {

    if (this.instance === null) {
        this.instance = new Nongo();
    }
    return this.instance;
};

module.exports = Nongo.getInstance();