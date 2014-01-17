(function () {
    'use strict';


    Nongo.Views.Database = Backbone.Marionette.Layout.extend({
        template: Nongo.Templates.Database,
        regions: {
            content: '#database-content'
        },
        initialize: function (options) {
            this.databaseName = this.options.databaseName;
        },
        serializeData: function () {
            return {
                database: this.databaseName
            };
        },
        showCollections: function(){
            this.showTab('collections');
        },
        showUsers: function(){
            this.showTab('users');
        },

        showTab: function(tab){
            this.$('.nav-tabs li').removeClass('active');
            this.$('.nav-tabs li[data-tab="' + tab + '"]').addClass('active');

            this.$('.tab-content > div').hide();
            this.$('.tab-content div#' + tab).show();
        },

        onDomRefresh: function(){
            this.collectionsView = new Nongo.Views.Collections({
                el: '#collections',
                databaseName: this.databaseName
            }).render();

            this.usersView = new Nongo.Views.Users({
                el: '#users',
                databaseName: this.databaseName
            }).render();
        }
    });
}());