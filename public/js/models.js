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


(function () {
    'use strict';

    Nongo.Models.Database = Backbone.Model.extend({
        idAttribute: 'db',
        urlRoot: '/api/db',
        initialize: function (options) {
        }
    });


    Nongo.Collections.Databases = Backbone.Collection.extend({
        model: Nongo.Models.Database,
        comparator: function(database) {
            return database.get('db');
        },
        url: function () {
            return '/api/db';
        },
        initialize: function (models, options) {
        }
    });
}());


(function () {
    'use strict';


    Nongo.Models.Document = Backbone.Model.extend({
        idAttribute: null,
        // url: function () {
        //     return '/api/db/' + this.databaseName + '/collections/' + this.collectionName + '/documents';
        // },
        initialize: function (attr, options) {
            if (!options) {
                options = {};
            }
            this.databaseName = options.databaseName || options.collection.databaseName;
            this.collectionName = options.collectionName || options.collection.collectionName;
            // this.databaseName = options.collection.databaseName;
            // this.collectionName = options.collection.collectionName;
        },
        parse: function(resp) {

            if(resp._id != null && resp._id['$oid'] != null){
                this.id = resp._id['$oid'];
            }

            return resp;
        },
        getCreationTime: function(){
            if(this.isNew()){
                return null;
            }

            var timestamp = this.id.toString().substring( 0, 8 );
            return new Date(parseInt(timestamp, 16 ) * 1000 );
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

