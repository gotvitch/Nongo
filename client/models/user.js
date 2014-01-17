(function () {
    'use strict';


    Nongo.Models.User = Backbone.Model.extend({
        idAttribute: 'name',
        initialize: function (attr, options) {
            this.databaseName = options.databaseName || options.collection.databaseName;
            this.urlRoot = '/api/db/' + this.databaseName + '/users';
        }
    });


    Nongo.Collections.Users = Backbone.Collection.extend({
        model: Nongo.Models.User,
        initialize: function (options) {
            this.databaseName = options.databaseName;
            this.url = '/api/db/' + this.databaseName + '/users';
        }
    });
}());

