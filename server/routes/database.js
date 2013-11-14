var Nongo = require('../nongo'),
    Q     = require('q'),
    _     = require('underscore');


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
                res.json(databases);
            })
            .fail(function (err) {
                next(err);
            });
    },
    create: function(req, res, next){

        var databaseName = req.body.database,
            errors;

        req.checkBody('database', 'database is required').notEmpty();

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
                        throw new Nongo.Error.ValidationError('database', 'database already exists');
                    }

                    return db;
                });
            })
            .then(function (db) {
                return Q.ninvoke(db, 'stats');
            })
            .then(function () {
                res.send(200);
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