var should       = require('should'),
    connectionPool = require('./../../server/lib/connectionPool');

describe('Connection pool', function () {

    var connections;

    before(function () {
        connections = new connectionPool('localhost', 27017);
    });


    it('connect to database', function (done) {
        connections
        .connectToDatabase('test')
        .then(function (db){
            should.exist(db);
            done();
        }, done);
    });

    it('use the same connection', function (done) {
        connections
        .connectToDatabase('test')
        .then(function (db1) {
            return db1;
        })
        .then(function (db1) {
            return connections.connectToDatabase('test').then(function (db2){
                should.strictEqual(db1, db2);
                done();
            });
        }).fail(done);
    });
});