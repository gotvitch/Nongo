(function () {
    'use strict';


    Nongo.Models.Collection = Backbone.Model.extend({
        validation: {
            name: {
                required: true
            }
        },
        url: function () {
            return '/api/db/' + this.databaseName + '/collections';
        },
        initialize: function (attr, options) {
            this.databaseName = options.databaseName;
        }
    });


    Nongo.Collections.Collections = Backbone.Collection.extend({
        model: Nongo.Models.Collection,
        url: function () {
            return '/api/db/' + this.databaseName + '/collections';
        },
        initialize: function (options) {
            this.databaseName = options.databaseName;
        }
    });
}());

