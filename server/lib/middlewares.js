/**
 * Custom middlewares
 *
 */

var Nongo             = require('./../nongo'),
    _                 = require('underscore'),
    expressValidator  = require('express-validator');

/**
 * Ensure we have a connection to the database, so that Mongo Edit doesn't crash
 * Useful when mongodb was restarted and the connection was cut
 */
module.exports = {
    
    connectToDatabase: function(req, res, next, database){
        
        Nongo.connections.connectToDatabase(database)
        .then(function(db){
            return next();
        })
        .fail(function (err) {
            next(err);
        });
    },
    singlePage: function(req, res, next){
        if(req.xhr){
            return next();
        }

        var skip = _.any(['/css', '/js', '/images', '/fonts', '/api'], function (url) {
            return req.url.substr(0, url.length) === url;
        });

        if(skip){
            return next();
        }

        return res.render('index');
    },

    validator: function(req, res, next){
        return expressValidator({
            errorFormatter: function(param, message, value) {
                return {
                    param : param,
                    message   : message,
                    value : value
                };
            }
        });
    },
    errorHandling: function(err, req, res, next){

        if(req.xhr || req.url.substr(0, 4) === '/api'){

            if(err instanceof Nongo.Error.ValidationError){
                res.send(422, err.errors);
            }else{
                next(err);
            }
        }else{
            next(err);
        }
    }
};