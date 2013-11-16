(function () {
    'use strict';


    Nongo.Views.Collection = Backbone.Marionette.Layout.extend({
        template: Nongo.Templates.Collection,
        regions: {
            content: '#collection-content'
        },
        initialize: function (options) {
            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;
        },
        showDocuments: function(documentId){
            var documentsView = new Nongo.Views.Documents({ databaseName: this.databaseName, collectionName: this.collectionName, documentId: documentId });
            this.content.show(documentsView);
        }
    });
}());