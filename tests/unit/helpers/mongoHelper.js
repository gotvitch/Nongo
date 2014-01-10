var Nongo            = require('../../../server/nongo'),
    Q                = require('q');



var mongoHelper = {
    testDatabaseName: 'nongo_test',
    connectToTestDatabase: function(){
        return Nongo.mongo.db(mongoHelper.testDatabaseName);
    },
    dropTestDatabase: function(){
        return Nongo.mongo.db(mongoHelper.testDatabaseName)
        .then(function (db) {
            return Q.ninvoke(db, 'dropDatabase');
        });
    },
    createTestDatabase: function(){
        return Nongo.mongo.db(mongoHelper.testDatabaseName)
        .then(function (db) {
            return Q.ninvoke(db, 'stats');
        });
    },
    listDatabases: function(){
        return Nongo.mongo.adminDb()
        .then(function (adminDb) {
            return Q.ninvoke(adminDb, 'listDatabases');
        })
        .then(function (dbs){
            return dbs.databases;
        });
    }
};

module.exports = mongoHelper;
