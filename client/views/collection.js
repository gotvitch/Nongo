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
        showDocuments: function(){
            var documentsView = new Nongo.Views.Documents({ databaseName: this.databaseName, collectionName: this.collectionName });
            this.content.show(documentsView);
        }
    });
}());