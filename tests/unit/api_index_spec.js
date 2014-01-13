var Nongo        = require('../../server/nongo'),
    request      = require('superagent'),
    should       = require('should'),
    Q            = require('q'),
    mongoHelper  = require('./helpers/mongoHelper'),
    nongoHelper  = require('./helpers/nongoHelper');



describe('API index', function () {
 
    var server,
        testCollectionName = 'collection_test';

    before (function (done) {
        nongoHelper.startServer()
        .then(function(srv){
            server = srv;
        })
        .then(mongoHelper.dropTestDatabase)
        .then(function(){
            return Nongo.mongo.db(mongoHelper.testDatabaseName)
            .then(function (db) {
                return Q.ninvoke(db, 'createCollection', testCollectionName);
            });
        })
        .then(function(){
            done();
        })
        .fail(done);
    });

    after(function (done) {
        server.close();
        done();
    });

    describe('Create index', function () {
        it('should create a index', function (done) {
            request
            .post(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/indexes')
            .set('Accept', 'application/json')
            .send({ keys: '{name:1}' })
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {

                    res.status.should.eql(200);

                    return mongoHelper.connectToTestDatabase()
                    .then(function (db) {
                        var collection = db.collection(testCollectionName);
                        return Q.ninvoke(collection, 'indexInformation', {full:true});
                    })
                    .then(function (indexes) {

                        should(indexes).be.instanceof(Array).and.have.lengthOf(2);
                        indexes[1].should.have.property('name', 'name_1');
                        indexes[1].should.have.property('key').and.eql({name: 1});
                        
                        done();
                    })
                    .fail(done);
                }
            });
        });
    });

    describe('List indexes', function () {
        it('should list indexes', function (done) {
            request
            .get(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/indexes')
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.status.should.eql(200);
                    res.body.should.be.instanceof(Array).and.have.lengthOf(2);
                    res.body[0].should.have.property('name', '_id_');
                    res.body[0].should.have.property('key').and.eql({_id: 1});

                    res.body[1].should.have.property('name', 'name_1');
                    res.body[1].should.have.property('key').and.eql({name: 1});

                    done();
                }
            });
        });
    });


    describe('Drop a index', function () {
        it('should drop a index', function (done) {
            request
            .del(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/indexes/name_1')
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    res.status.should.eql(200);

                    return mongoHelper.connectToTestDatabase()
                    .then(function (db) {
                        var collection = db.collection(testCollectionName);
                        return Q.ninvoke(collection, 'indexInformation', {full:true});
                    })
                    .then(function (indexes) {
                        indexes.should.be.instanceof(Array).and.have.lengthOf(1);

                        done();
                    })
                    .fail(done);
                }
            });
        });
    });
});