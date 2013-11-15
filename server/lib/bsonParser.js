var mongodb = require('mongodb'),
    _       = require('underscore');

var formatBSON = function(object){
    if(object instanceof mongodb.ObjectID)
    {
        return { '$oid': object.toString() };
    }
    else if(object instanceof Date)
    {
        return { '$date': object.toJSON() };
    }
    else if(object instanceof mongodb.Timestamp)
    {
        return { '$timestamp': { t: object.low_, i: object.high_ } };
    }
    else if(object instanceof mongodb.DBRef)
    {
        return {
            '$ref':object.namespace,
            '$id': formatBSON(object.oid),
            '$db':object.db || ''
        };
    }
    else if(object instanceof Array || object instanceof Object)
    {
        _.each(object, function(value, key){
            object[key] = formatBSON(value);
        });
    }
    else
    {
        return object;
    }

    return object;
};


var toBSON = function(object){
    if(object['$oid'] !== undefined){
        return new mongodb.ObjectID(object['$oid']);
    }
    else if(object['$date'] !== undefined)
    {
        return new Date(object['$date']);
    }
    else if(object['$timestamp'] !== undefined)
    {
        return new mongodb.Timestamp(object['$timestamp'].t, object['$timestamp'].i);
    }
    else if(object['$ref'] !== undefined)
    {
        return new mongodb.DBRef(object['$ref'], toBSON(object['$id']), object['$db']);
    }
    else if(object instanceof Array || object instanceof Object)
    {
        _.each(object, function(value, key){
            object[key] = toBSON(value);
        });
    }
    else
    {
        return object;
    }

    return object;
};

module.exports = {
    toBSON: toBSON,
    formatBSON: formatBSON

};