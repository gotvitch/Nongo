(function () {
    'use strict';

    Nongo.Router = Backbone.Router.extend({
        routes: {
            'test': 'test',
            'databases/:database/collections/:collection': 'collection',
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
        defaultRoute: function () {
            Nongo.appView.showHome();
        }
    });
}());


