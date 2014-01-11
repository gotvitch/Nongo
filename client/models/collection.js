(function () {
    'use strict';


    Nongo.Models.Collection = Backbone.Model.extend({
        idAttribute: 'name',
        initialize: function (attr, options) {
            this.databaseName = options.databaseName || options.collection.databaseName;
            this.urlRoot = '/api/db/' + this.databaseName + '/collections';
        }
    });


    Nongo.Collections.Collections = Backbone.Collection.extend({
        model: Nongo.Models.Collection,
        initialize: function (options) {
            this.databaseName = options.databaseName;
            this.url = '/api/db/' + this.databaseName + '/collections';
        }
    });
}());

