var should       = require('should'),
    Mongo = require('./../../server/lib/mongo');

describe('Mongo', function () {

    var mongo;

    before(function (done) {
        mongo = new Mongo({ url: 'mongodb://localhost:27017/test'});
        mongo.connect()
        .then(done)
        .done();
    });


    it('connect to database', function (done) {
        mongo.db('test')
        .then(function (db){
            should.exist(db);
            db.should.have.property('databaseName', 'test');
            done();
        }, done);
    });

    it('use the same connection', function (done) {
        mongo.db('test')
        .then(function (db1) {
            return db1;
        })
        .then(function (db1) {
            return mongo.db('test').then(function (db2){
                should.strictEqual(db1, db2);
                done();
            });
        }).fail(done);
    });

    after(function (done) {
        mongo.close()
        .then(done)
        .done();
    });
});