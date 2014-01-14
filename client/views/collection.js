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
        serializeData: function () {
            return {
                database: this.databaseName,
                collection: this.collectionName
            };
        },
        showDocuments: function(documentId){
            this.showTab('documents');
            this.documentsView.showDocuments(documentId);
        },
        showIndexes: function(){
            this.showTab('indexes');
        },

        showTab: function(tab){
            this.$('.nav-tabs li').removeClass('active');
            this.$('.nav-tabs li[data-tab="' + tab + '"]').addClass('active');

            this.$('.tab-content > div').hide();
            this.$('.tab-content div#' + tab).show();
        },

        onDomRefresh: function(){
            this.documentsView = new Nongo.Views.Documents({
                el: '#documents',
                databaseName: this.databaseName,
                collectionName: this.collectionName
            }).render();

            this.indexesView = new Nongo.Views.Indexes({
                el: '#indexes',
                databaseName: this.databaseName,
                collectionName: this.collectionName
            }).render();
        }
    });
}());