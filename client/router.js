(function () {
    'use strict';

    Nongo.Router = Backbone.Router.extend({
        routes: {
            'test': 'test',
            'databases/:database/collections/:collection': 'collection',
            'databases/:database/collections/:collection/documents/:document': 'document',
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
        document: function(database, collection, doc){
            Nongo.appView.showDocuments(database, collection, doc);
        },
        defaultRoute: function () {
            Nongo.appView.showHome();
        }
    });
}());


