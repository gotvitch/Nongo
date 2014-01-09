var Nongo = require('../nongo'),
    Q     = require('q'),
    _     = require('lodash');


module.exports = {
    list: function(req, res, next){
        Nongo.connections
            .connectToDatabase('local')
            .then(function (db) {
                var adminDb = db.admin();
                //return Q.ninvoke(adminDb, 'listDatabases');

                return Q.ninvoke(adminDb, 'listDatabases')
                .then(function (dbs) {
                    return Q.all(dbs.databases.map(function(database){
                        return Nongo.connections
                        .connectToDatabase(database.name)
                        .then(function(db){
                            return Q.ninvoke(db, 'stats');
                        });
                    }));
                });

            })
            .then(function (databases){
                res.json(_.sortBy(databases, 'db'));
            })
            .fail(function (err) {
                next(err);
            });
    },
    create: function(req, res, next){

        var databaseName = req.body.name,
            errors;

        req.checkBody('name', 'database name is required').notEmpty();

        errors = req.validationErrors();

        if (errors) {
            throw new Nongo.Error.ValidationError(errors);
        }

        Nongo.connections
            .connectToDatabase(databaseName)
            .then(function (db) {
                var adminDb = db.admin();

                return Q.ninvoke(adminDb, 'listDatabases')
                .then(function(dbs){

                    if(_.any(dbs.databases, function (db) { return db.name === databaseName; })){
                        throw new Nongo.Error.ValidationError('name', 'database already exists');
                    }

                    return db;
                });
            })
            .then(function (db) {
                return Q.ninvoke(db, 'stats');
            })
            .then(function (stats) {
                res.json({ name: databaseName });
            })
            .fail(function (err) {
                next(err);
            })
            .done();
    },
    drop: function(req, res, next){

        var databaseName = req.params.database,
            errors;

        req.assert('database', 'database is required').notEmpty();

        errors = req.validationErrors();

        if (errors) {
            throw new Nongo.Error.ValidationError(errors);
        }

        Nongo.connections
            .connectToDatabase(databaseName)
            .then(function (db) {
                return Q.ninvoke(db, 'dropDatabase');
            })
            .then(function () {
                res.send(200);
            })
            .fail(function (err) {
                next(err);
            })
            .done();
    }
};