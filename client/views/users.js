(function () {
    'use strict';


    Nongo.Views.UsersItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.UsersItem,
        tagName: 'tr',
        events: {
            'click .js-delete': 'delete'
        },
        initialize: function(options){

        },
        delete: function(){
            if(confirm('Are you sure to delete the database ' + this.model.get('db') + ' ?')){
                this.model.destroy({
                    success: function(model, response) {
                
                    }
                });
            }
        }
    });

    Nongo.Views.Users = Backbone.Marionette.CompositeView.extend({
        template: Nongo.Templates.Users,
        itemView: Nongo.Views.UsersItem,
        itemViewContainer: 'tbody',
        events: {
            'click .js-refresh': 'refresh',
        },
        initialize: function(options){
            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;
            
            this.collection = new Nongo.Collections.Users({ databaseName: this.databaseName, collectionName: this.collectionName });
            this.collection.fetch({});
        },
        refresh: function(e){
            this.collection.fetch();
        }
    });
}());