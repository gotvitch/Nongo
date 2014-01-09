var Nongo        = require('../../server/nongo'),
    request      = require('superagent'),
    should       = require('should'),
    _            = require('lodash'),
    Q            = require('q'),
    mongoHelper  = require('./helpers/mongoHelper'),
    nongoHelper  = require('./helpers/nongoHelper');



describe('API collection', function () {
 
    var server,
        testCollectionName = 'collection_test';

    before (function (done) {
        nongoHelper.startServer()
        .then(function(srv){
            server = srv;
            done();
        })
        .then(mongoHelper.dropTestDatabase)
        .fail(done);
    });

    after(function (done) {
        server.close();
        done();
    });

    describe('Create collection', function () {
        it('should create collection', function (done) {
            request
            .post(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections')
            .set('Accept', 'application/json')
            .send({ name: testCollectionName, size: 10000, max: 10000 })
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {

                    res.status.should.eql(200);

                    return mongoHelper.connectToTestDatabase()
                    .then(function (db) {
                        return Q.ninvoke(db, 'collectionNames');
                    })
                    .then(function (collections) {
                        var anyResult = _.any(collections, function (collection) {
                            return collection.name === mongoHelper.testDatabaseName + '.' + testCollectionName;
                        });
                        /*jshint -W030 */
                        should(anyResult).be.true;
                        /*jshint +W030 */

                        
                        done();
                    })
                    .fail(done);
                }
            });
        });

        it('should not create collection if param missing/incorrect', function (done) {
            request
            .post(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections')
            .set('Accept', 'application/json')
            .send({ size: 'str', max: 'str' })
            .end(function(res){
                res.status.should.eql(422);

                res.body.should.be.instanceof(Array).and.have.lengthOf(3);
                res.body[0].should.have.property('param').and.equal('name');
                res.body[0].should.have.property('message').and.equal('name is required');
                res.body[1].should.have.property('param').and.equal('size');
                res.body[1].should.have.property('message').and.equal('size must be a integer');
                res.body[2].should.have.property('param').and.equal('max');
                res.body[2].should.have.property('message').and.equal('max must be a integer');

                done();

            });
        });
    });

    describe('List collection', function () {
        it('should list collection', function (done) {
            request
            .get(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections')
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.status.should.eql(200);
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                    res.body[0].should.have.property('name').and.equal(testCollectionName);
                    done();
                }
            });
        });
    });

    describe('Drop collection', function () {
        it('should drop collection', function (done) {
            request
            .del(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName)
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    
                    return mongoHelper.connectToTestDatabase()
                    .then(function (db) {
                        return Q.ninvoke(db, 'collectionNames');
                    })
                    .then(function (collections) {

                        var anyResult = _.any(collections, function(collection) {
                            return collection.name === mongoHelper.testDatabaseName + '.' + testCollectionName;
                        });
                        /*jshint -W030 */
                        should(anyResult).be.false;
                        /*jshint +W030 */
                        done();
                    })
                    .fail(done);
                }
            });
        });
    });
});