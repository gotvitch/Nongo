var Nongo = require('../nongo'),
    Q     = require('q'),
    _     = require('lodash');


module.exports = {
    list: function(req, res, next){

        var databaseName = req.params.database,
            collectionName = req.params.collection;

        Nongo.mongo
            .db(databaseName)
            .then(function (db) {
                var collection = db.collection(collectionName);
                return Q.ninvoke(collection, 'indexInformation', {full:true});
            })
            .then(function (indexes) {

                res.send(
                    _.chain(indexes)
                    .map(function(index){
                        return {
                            name: index.name,
                            unique: index.unique || false,
                            background:  index.background || false,
                            sparse: index.sparse || false,
                            key: index.key
                        };
                    })
                    .sortBy('name')
                    .value()
                );
            })
            .fail(function (err) {
                next(err);
            })
            .done();
    },
    create: function(req, res, next){

        var databaseName = req.params.database,
            collectionName = req.params.collection,
            keys = req.body.keys,
            name = req.body.name,
            unique = req.body.unique,
            sparse = req.body.sparse,
            errors;

        req.assert('keys', 'keys is required').notEmpty();

        try{
            eval('keys = ' + keys);
        }catch(e){
            throw new Nongo.Error.ValidationError('keys', 'Keys invalid.');
        }

        errors = req.validationErrors();

        if (errors) {
            throw new Nongo.Error.ValidationError(errors);
        }

        Nongo.mongo
            .db(databaseName)
            .then(function (db) {

                var collection = db.collection(collectionName),
                    options = { background: true };

                if (name) {
                    options.name = name;
                }

                if (unique) {
                    options.unique = unique;
                }

                if (sparse) {
                    options.sparse = sparse;
                }

                return Q.ninvoke(collection, 'ensureIndex', keys, options);
            })
            .then(function (index) {
                return res.json(index);
            })
            .fail(function (err) {
                next(err);
            })
            .done();
    },
    drop: function(req, res, next){

        var databaseName = req.params.database,
            collectionName = req.params.collection,
            indexName = req.params.name;

        Nongo.mongo
            .db(databaseName)
            .then(function (db) {

                var collection = db.collection(collectionName);

                return Q.ninvoke(collection, 'dropIndex', indexName);
            })
            .then(function () {
                return res.send(200);
            })
            .fail(function (err) {
                next(err);
            })
            .done();
    },
};