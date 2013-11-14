(function () {
    'use strict';


    Nongo.Views.DatabaseItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.DatabaseItem,
        tagName: 'tr',
        initialize: function(options){

        }
    });

    Nongo.Views.Home = Backbone.Marionette.CompositeView.extend({
        template: Nongo.Templates.Home,
        itemView: Nongo.Views.DatabaseItem,
        itemViewContainer: 'tbody',

        events: {
            'click .js-refresh': 'refresh'
        },
        initialize: function(options){

        },
        refresh: function(e){
            this.collection.fetch();
        }
    });
}());