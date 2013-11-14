(function () {
    'use strict';

    Nongo.Views.App = Backbone.Marionette.Layout.extend({
        el: 'body',
        //template: Nongo.Templates.App,
        regions: {
            content: '#content'
        },
        initialize: function () {
            //return this.render();
        },
        showHome: function(){
            var self = this,
                databases = new Nongo.Collections.Databases({});

            databases.fetch({
                success: function () {
                    self.content.show(new Nongo.Views.Home({
                        collection: databases
                    }));
                }
            });
        },
        showTest: function(){
            

            //this.content.show());
        },
        showDatabase: function(databaseName){
            var databaseView = new Nongo.Views.Database({ databaseName: databaseName });
            
            this.content.show(databaseView);

            databaseView.showCollections();
        },
        showCollection: function (databaseName, collectionName) {
            var collectionView = new Nongo.Views.Collection({ databaseName: databaseName, collectionName: collectionName });
            this.content.show(collectionView);
            collectionView.showDocuments();
        }
    });
}());