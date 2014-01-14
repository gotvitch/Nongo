(function () {
    'use strict';

    Nongo.Router = Backbone.Router.extend({
        routes: {
            'test': 'test',
            'databases/:database/collections/:collection/documents/:document': 'document',
            'databases/:database/collections/:collection/indexes': 'indexes',
            'databases/:database/collections/:collection': 'documents',
            'databases/:database': 'database',
            '*actions': 'defaultRoute',
            ':notFound': 'notFound'
        },
        test: function(){
            Nongo.appView.showTest();
        },
        database: function(database){
            Nongo.appView.showDatabase(database);
        },
        collection: function(database, collection){
            Nongo.appView.showCollection(database, collection);
        },
        documents: function(database, collection){
            Nongo.appView.showDocuments(database, collection);
        },
        document: function(database, collection, doc){
            Nongo.appView.showDocuments(database, collection, doc);
        },
        indexes: function(database, collection, doc){
            Nongo.appView.showIndexes(database, collection);
        },
        defaultRoute: function () {
            Nongo.appView.showHome();
        }
    });
}());


