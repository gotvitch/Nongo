var Nongo            = require('../../../server/nongo'),
    Q                = require('q');



var mongoHelper = {
    testDatabaseName: 'nongo_test',
    dropTestDatabase: function(){
        return Nongo.connections
        .connectToDatabase(mongoHelper.testDatabaseName)
        .then(function (db) {
            return Q.ninvoke(db, 'dropDatabase');
        });
    },
    createTestDatabase: function(){
        return Nongo.connections
        .connectToDatabase(mongoHelper.testDatabaseName)
        .then(function (db) {
            return Q.ninvoke(db, 'stats');
        });
    },
    listDatabases: function(){
        return Nongo.connections
        .connectToDatabase('local')
        .then(function (db) {
            var adminDb = db.admin();
            return Q.ninvoke(adminDb, 'listDatabases');
        })
        .then(function (dbs){
            return dbs.databases;
        });
    }
};

module.exports = mongoHelper;
