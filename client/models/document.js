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

