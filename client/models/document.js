(function () {
    'use strict';


    Nongo.Models.Document = Backbone.Model.extend({
        url: function () {
            return '/api/db/' + this.database + '/collections/' + this.collectionName + '/documents';
        },
        initialize: function (attr, options) {
            if (!options) {
                options = {};
            }
            this.databaseName = options.databaseName;
            this.collectionName = options.collectionName;
        }
    });

    Nongo.Collections.Documents = Backbone.Collection.extend({
        model: Nongo.Models.Document,
        url: function () {
            return '/api/db/' + this.databaseName + '/collections/' + this.collectionName + '/documents';
        },
        initialize: function (options) {
            if (!options) {
                options = {};
            }

            this.databaseName = options.databaseName;
            this.collectionName = options.collectionName;
        }
    });
}());

