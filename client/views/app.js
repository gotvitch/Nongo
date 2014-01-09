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
            this.breabcrumbView = new Nongo.Views.Breadcrumb();
        },
        updateBreadCrumb: function(data){

        },
        showHome: function(){
            var self = this,
                databases = new Nongo.Collections.Databases({});

            databases.fetch({
                success: function () {
                    self.content.show(new Nongo.Views.Home({
                        collection: databases
                    }));

                    self.breabcrumbView.update({});
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

            this.breabcrumbView.update({ database: databaseName });
        },
        showCollection: function (databaseName, collectionName) {
            var collectionView = new Nongo.Views.Collection({ databaseName: databaseName, collectionName: collectionName });
            this.content.show(collectionView);
            collectionView.showDocuments();

            this.breabcrumbView.update({ database: databaseName, collection: collectionName });
        },
        showDocuments: function (databaseName, collectionName, documentId) {
            var collectionView = new Nongo.Views.Collection({ databaseName: databaseName, collectionName: collectionName });
            this.content.show(collectionView);
            collectionView.showDocuments(documentId);

            this.breabcrumbView.update({ database: databaseName, collection: collectionName });
        }
    });
}());