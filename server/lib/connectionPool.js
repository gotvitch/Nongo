// Module dependencies
var Db             = require('mongodb').Db,
    Server         = require('mongodb').Server,
    Q              = require('q'),
    ConnectionPool;

ConnectionPool = function (hostname, port) {

    this.connections = {};
    this.hostname = hostname;
    this.port = port;

    return this;
};


ConnectionPool.prototype.connectToDatabase = function(database){

    var deferred = Q.defer(),
        self = this;

    if (this.connections[database]) {
        deferred.resolve(this.connections[database]);
    } else {
        var db = new Db(database, new Server(this.hostname, this.port), {safe:false});

        db.open(function(err, db){
            if (err) {
                deferred.reject(err);
            }else{
                self.connections[database] = db;
                deferred.resolve(self.connections[database]);
            }
        });
    }

    return deferred.promise;
};


 
module.exports = ConnectionPool;