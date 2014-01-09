/**
 * Custom middlewares
 *
 */

var Nongo             = require('./../nongo'),
    _                 = require('lodash'),
    expressValidator  = require('express-validator');


module.exports = {
    
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