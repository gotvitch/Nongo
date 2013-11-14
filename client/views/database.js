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
        showCollections: function(){
            var collectionsView = new Nongo.Views.Collections({ databaseName: this.databaseName });
            this.content.show(collectionsView);
        }
    });
}());