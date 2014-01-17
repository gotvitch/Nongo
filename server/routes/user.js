var Nongo                  = require('../nongo'),
    Q                      = require('q'),
    _                      = require('lodash'),
    SYSTEM_USER_COLLECTION = 'system.users';


module.exports = {
    list: function(req, res, next){

        var databaseName = req.params.database;

        Nongo.mongo
            .db(databaseName)
            .then(function (db) {
                var cursor = db.collection(SYSTEM_USER_COLLECTION).find();

                return Q.ninvoke(cursor, 'toArray');
            })
            .then(function (users) {

                res.send(
                    _.chain(users)
                    .map(function(user){
                        return {
                            name: user.user,
                            read_only: user.readOnly || false
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
    }
};