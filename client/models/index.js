(function () {
    'use strict';


    Nongo.Models.Index = Backbone.Model.extend({
        idAttribute: 'name',
        initialize: function (attr, options) {
            this.databaseName = options.databaseName || options.collection.databaseName;
            this.collectionName = options.collectionName || options.collection.collectionName;
            this.urlRoot = '/api/db/' + this.databaseName + '/collections/' + this.collectionName + '/indexes';
        }
    });


    Nongo.Collections.Indexes = Backbone.Collection.extend({
        model: Nongo.Models.Index,
        initialize: function (options) {
            this.databaseName = options.databaseName;
            this.collectionName = options.collectionName;
            this.url = '/api/db/' + this.databaseName + '/collections/' + this.collectionName + '/indexes';
        }
    });
}());

