var should       = require('should'),
    mongodb = require('mongodb'),
    bsonParser = require('./../../server/lib/bsonParser');


describe('BSON parser', function () {


    it('parse', function () {
        
        var date = new Date();

        var objectToParse = {
            _id: new mongodb.ObjectID('527c2f9285c3b369fc00002b'),
            date: date,
            timestamp: new mongodb.Timestamp(24, 3),
            ref: new mongodb.DBRef('namespace', 'oid', 'db'),
            array: [
                {
                    _id: new mongodb.ObjectID('527a8aa4d5e9349922000002'),
                    text: 'item1'
                },
                {
                    _id: new mongodb.ObjectID('527c2f9285c3b369fc000183'),
                    text: 'item2'
                }
            ]
        };

        var result = bsonParser.formatBSON(objectToParse);

        var expectedResult = {
            _id: {
                '$oid': '527c2f9285c3b369fc00002b'
            },
            date: {
                '$date': date.toISOString()
            },
            timestamp: {
                '$timestamp': { t: 24, i: 3 }
            },
            ref: {
                '$ref': 'namespace',
                '$id': 'oid',
                '$db': 'db'
            },
            array: [
                {
                    _id: {
                        '$oid': '527a8aa4d5e9349922000002'
                    },
                    text: 'item1'
                },
                {
                    _id: {
                        '$oid': '527c2f9285c3b369fc000183'
                    },
                    text: 'item2'
                }
            ]
        };

        should(result).eql(expectedResult);
    });
});