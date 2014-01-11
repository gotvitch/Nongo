(function () {
    'use strict';


    Nongo.Views.Breadcrumb = Backbone.View.extend({
        el: '#breadcrumb',
        initialize: function () {
            
        },
        update: function(data){
            this.updateDatabases(data.database);
            this.updateCollections(data.database, data.collection);
        },
        updateDatabases: function(database){

            var self = this;

            if(database){
                self.$('.database-name').html(database);

                $.get('/api/db/names', function( data ) {
                    var dbHtml = '';

                    _.each(data, function(db){
                        dbHtml += '<li><a href="/databases/' + db + '" data-link="push">' + db + '</a></li>';
                    });

                    self.$('#database-selection > ul').html(dbHtml);
                    self.$('#database-selection').show();
                });
            }else{
                self.$('#database-selection').hide();
            }
        },
        updateCollections: function(database, collection){
            
            var self = this;

            if(collection){
                self.$('.collection-name').html(collection);

                $.get('/api/db/' + database + '/collections/names', function( data ) {
                    var collectionHtml = '';

                    _.each(data, function(collection){
                        collectionHtml += '<li><a href="/databases/' + database + '/collections/' + collection + '" data-link="push">' + collection + '</a></li>';
                    });
                    
                    self.$('#collection-selection > ul').html(collectionHtml);
                    self.$('#collection-selection').show();
                });
            }else{
                self.$('#collection-selection').hide();
            }
        }

    });
}());