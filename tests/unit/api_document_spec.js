var Nongo        = require('../../server/nongo'),
    request      = require('superagent'),
    should       = require('should'),
    Q            = require('q'),
    mongoHelper  = require('./helpers/mongoHelper'),
    nongoHelper  = require('./helpers/nongoHelper');



describe('API documents', function () {
 
    var server,
        testCollectionName = 'collection_test';

    before (function (done) {
        nongoHelper.startServer()
        .then(function(srv){
            server = srv;
        })
        .then(mongoHelper.dropTestDatabase)
        .then(function(){
            return Nongo.connections
            .connectToDatabase(mongoHelper.testDatabaseName)
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

        nongoHelper.startServer()
        .then(function(srv){
            server = srv;
        })
        .then(mongoHelper.dropTestDatabase)
        .then(function(){
            done();
        })
        .fail(done);
    });


    describe('List documents', function () {

        before (function (done) {
            return Nongo.connections
            .connectToDatabase(mongoHelper.testDatabaseName)
            .then(function (db) {

                var collection = db.collection(testCollectionName);

                return Q.ninvoke(collection, 'insert', {hello:'world'});
            })
            .then(function(){
                done();
            })
            .fail(done);
        });

        after (function (done) {
            return Nongo.connections
            .connectToDatabase(mongoHelper.testDatabaseName)
            .then(function (db) {
                
                var collection = db.collection(testCollectionName);

                return Q.ninvoke(collection, 'drop');
            })
            .then(function(){
                done();
            })
            .fail(done);
        });

        it('should list documents', function (done) {
            request
            .get(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/documents')
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {


                    should(res.status).eql(200);
                    should(res.body).be.instanceof(Array).and.have.lengthOf(1);
                    should(res.body[0]).have.property('hello').and.equal('world');
                    done();
                }
            });
        });
    });

    describe('Update documents', function () {

        var documentToUpdate;

        before (function (done) {
            return Nongo.connections
            .connectToDatabase(mongoHelper.testDatabaseName)
            .then(function (db) {

                var collection = db.collection(testCollectionName);

                return Q.ninvoke(collection, 'insert', {hello:'world'});
            })
            .then(function(doc){
                documentToUpdate = doc[0];
                done();
            })
            .fail(done);
        });

        after (function (done) {
            return Nongo.connections
            .connectToDatabase(mongoHelper.testDatabaseName)
            .then(function (db) {
                
                var collection = db.collection(testCollectionName);

                return Q.ninvoke(collection, 'drop');
            })
            .then(function(){
                done();
            })
            .fail(done);
        });

        it('should update a document', function (done) {
            request
            .put(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/documents/' + documentToUpdate._id)
            .send({ hello: 'world_update'  })
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    should(res.status).eql(200);

                    var documentExpect = {
                        _id:{
                            '$oid': documentToUpdate._id.toString(),
                        },
                        hello: 'world_update'
                    };

                    should(res.body).eql(documentExpect);

                    done();
                }
            });
        });
    });
});