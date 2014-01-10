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
            return Nongo.mongo.db(mongoHelper.testDatabaseName)
            .then(function (db) {

                var collection = db.collection(testCollectionName);


                var documents = [
                    {
                        hello: 'world',
                        type: 'a',
                        order: 2
                    },
                    {
                        hello: 'moon',
                        type: 'b',
                        order: 3
                    },
                    {
                        hello: 'world',
                        type: 'a',
                        order: 1
                    }
                ];

                return Q.ninvoke(collection, 'insert', documents);
            })
            .then(function(){
                done();
            })
            .fail(done);
        });

        after (function (done) {
            return Nongo.mongo.db(mongoHelper.testDatabaseName)
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
                    should(res.body).be.instanceof(Array).and.have.lengthOf(3);
                    should(res.body[0]).have.property('hello').and.equal('world');
                    done();
                }
            });
        });

        it('should query documents', function (done) {

            var url = Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/documents?';
            url += 'query={"hello":"moon"}';

            request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    should(res.status).eql(200);
                    should(res.body).be.instanceof(Array).and.have.lengthOf(1);
                    should(res.body[0]).have.property('hello').and.equal('moon');
                    done();
                }
            });
        });

        it('should sort, skip and select field', function (done) {

            var url = Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/documents?';
            url += 'sort={"order":1}&skip=1&fields={"order":1}';

            request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    should(res.status).eql(200);
                    should(res.body).be.instanceof(Array).and.have.lengthOf(2);
                    should(res.body[0]).have.property('order').and.equal(2);
                    should(res.body[1]).have.property('order').and.equal(3);

                    should(res.body[0]).not.have.properties('hello', 'type');
                    should(res.body[1]).not.have.properties('order', 'type');

                    done();
                }
            });
        });

        it('should control query', function (done) {

            var url = Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/documents?';
            url += 'query={"order":1';

            request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(res){
                res.status.should.eql(422);

                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                res.body[0].should.have.property('param').and.equal('query');
                res.body[0].should.have.property('message').and.equal('The query contains invalid BSON.');

                done();
            });
        });
    });

    describe('Update documents', function () {

        var documentToUpdate;

        before (function (done) {
            return Nongo.mongo.db(mongoHelper.testDatabaseName)
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
            return Nongo.mongo.db(mongoHelper.testDatabaseName)
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


    describe('Create documents', function () {

        after (function (done) {
            return Nongo.mongo.db(mongoHelper.testDatabaseName)
            .then(function (db) {
                
                var collection = db.collection(testCollectionName);

                return Q.ninvoke(collection, 'drop');
            })
            .then(function(){
                done();
            })
            .fail(done);
        });

        it('should Create a document', function (done) {

            var documentToSave = {
                hello: 'world',
                test_id: {
                    '$oid': '528d36223fc466604800022b'
                }
            };

            request
            .post(Nongo.apiUrl + 'db/' + mongoHelper.testDatabaseName + '/collections/' + testCollectionName + '/documents')
            .send(documentToSave)
            .set('Accept', 'application/json')
            .end(function(res){
                if (res.error) {
                    done(res.error);
                } else {
                    should(res.body).have.property('hello').and.equal('world');
                    should(res.body).have.property('test_id').and.eql(documentToSave.test_id);

                    done();
                }
            });
        });
    });
});