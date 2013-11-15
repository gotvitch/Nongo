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


(function () {
    'use strict';


    Nongo.Models.Database = Backbone.Model.extend({
        url: function () {
            return '/api/db/' + this.get('name');
        },
        initialize: function (options) {
        }
    });


    Nongo.Collections.Databases = Backbone.Collection.extend({
        model: Nongo.Models.Database,
        comparator: function(database) {
            return database.get('name');
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
            this.databaseName = options.collection.databaseName;
            this.collectionName = options.collection.collectionName;
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

