(function () {
    'use strict';


    Nongo.Views.Breadcrumb = Backbone.View.extend({
        template: Nongo.Templates.Breadcrumb,
        el: '#breadcrumb',
        initialize: function () {
            
        },
        update: function(data){

            var dataTemplate = [];

            if(data.database != null){
                dataTemplate.push({
                    value: data.database,
                    url: '/databases/' + data.database
                });

                if(data.collection != null){
                    dataTemplate.push({
                        value: data.collection,
                        url: '/databases/' + data.database + '/collections/' + data.collection
                    });
                }
            }


            this.$el.html(this.template(dataTemplate));
        }
    });
}());