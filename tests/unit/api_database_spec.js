var Nongo        = require('../../server/nongo'),
    request      = require('superagent'),
    should       = require('should'),
    _            = require('lodash'),
    mongoHelper  = require('./helpers/mongoHelper'),
    nongoHelper  = require('./helpers/nongoHelper');



describe('API database', function () {
 
    var server;

    before (function (done) {
        nongoHelper.startServer()
        .then(function(srv){
            server = srv;
            done();
        })
        .fail(done);
    });

    after(function (done) {
        server.close();
        done();
    });


    describe('List database', function () {

        var databases;

        before (function (done) {
            mongoHelper.listDatabases()
            .then(function (dbs){
                databases = dbs;
                done();
            })
            .fail(done);
        });

        it('should return all databases', function (done) {
            request
            .get(Nongo.apiUrl + 'db')
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(databases.length);
                    done();
                }
            });
        });
    });


    describe('List database names', function () {

        var databases;

        before (function (done) {
            mongoHelper.listDatabases()
            .then(function (dbs){
                databases = dbs;
                done();
            })
            .fail(done);
        });

        it('should return all databases names', function (done) {
            request
            .get(Nongo.apiUrl + 'db/names')
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(databases.length);
                    done();
                }
            });
        });
    });


    describe('Create database', function () {

        before (function (done) {
            mongoHelper.dropTestDatabase()
            .then(function () {
                done();
            })
            .fail(done);
        });

        after(function (done) {
            mongoHelper.dropTestDatabase()
            .then(function () {
                done();
            })
            .fail(done);
        });


        it('should create database', function (done) {
            request
            .post(Nongo.apiUrl + 'db')
            .set('Accept', 'application/json')
            .send({ name: mongoHelper.testDatabaseName })
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.status.should.eql(200);

                    mongoHelper.listDatabases()
                    .then(function (dbs){
                        var database = _.find(dbs, function(db){ return db.name === mongoHelper.testDatabaseName; });
                        /*jshint -W030 */
                        should(database).not.be.empty;
                        /*jshint +W030 */
                        done();
                    })
                    .fail(done);
                }
            });
        });

        it('should not create database if param missing', function (done) {
            request
            .post(Nongo.apiUrl + 'db')
            .set('Accept', 'application/json')
            .end(function(res){
                res.status.should.eql(422);

                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                res.body[0].should.have.property('param').and.equal('name');
                res.body[0].should.have.property('message').and.equal('database name is required');

                done();

            });
        });


        it('should not create database already exists', function (done) {
            request
            .post(Nongo.apiUrl + 'db')
            .set('Accept', 'application/json')
            .send({ name: mongoHelper.testDatabaseName })
            .end(function(res){
                res.status.should.eql(422);

                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                res.body[0].should.have.property('param').and.equal('name');
                res.body[0].should.have.property('message').and.equal('database already exists');

                done();
            });
        });
    });


    describe('Drop database', function () {


        before (function (done) {
            mongoHelper.createTestDatabase()
            .then(function () {
                done();
            })
            .fail(done);
        });

        it('should drop database', function (done) {
            request
            .del(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName)
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.status.should.eql(200);

                    mongoHelper.listDatabases()
                    .then(function (dbs){
                        var database = _.find(dbs, function(db){ return db.name === mongoHelper.testDatabaseName; });
                        should.equal(database, null);
                        done();
                    })
                    .fail(done);
                }
            });
        });
    });
});