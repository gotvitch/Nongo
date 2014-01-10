// Module dependencies
var MongoClient     = require('mongodb').MongoClient,
    Q              = require('q'),
    Mongo;

Mongo = function (options) {

    this.hostname = options.hostname;
    this.port = options.port;

    if(options.url != null){
        this.url = options.url;
    }else{
        this.url = 'mongodb://' + (this.auth ? (this.auth.username + ':' + this.auth.password + '#') : '') + this.hostname + ':' + this.port;
    }

    return this;
};


Mongo.prototype.connect = function(){

    var self = this;

    return Q.ninvoke(MongoClient, 'connect', this.url)
    .then(function(db){
        self.connection = db;
    });
};

Mongo.prototype.close = function(){

    var self = this;

    return Q.ninvoke(self.connection, 'close')
    .then(function(){
        self.connection = null;
    });
};

Mongo.prototype.db = function(database){

    var self = this;

    return Q.fcall(function () {
        return self.connection.db(database);
    });
};

Mongo.prototype.adminDb = function(){

    var self = this;

    return Q.fcall(function () {
        return self.connection.admin();
    });
};


 
module.exports = Mongo;