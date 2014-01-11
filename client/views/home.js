(function () {
    'use strict';


    Nongo.Views.DatabaseItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.DatabaseItem,
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

    Nongo.Views.Home = Backbone.Marionette.CompositeView.extend({
        template: Nongo.Templates.Home,
        itemView: Nongo.Views.DatabaseItem,
        itemViewContainer: 'tbody',
        events: {
            'click .js-refresh': 'refresh',
            'click .js-add': 'showAddDatabase'
        },
        initialize: function(options){

        },
        refresh: function(e){
            this.collection.fetch();
        },
        showAddDatabase: function(){
            this.shellForm = new Nongo.Views.ShellForm({
                cancel: true,
                config: 'use'
            });

            this.listenTo(this.shellForm, 'submit', this.addDatabase, this);
            this.listenTo(this.shellForm, 'cancel', this.closeShellForm, this);

            this.shellForm.render();

            this.$('.shell-form-wrapper').html(this.shellForm.$el.hide());

            this.shellForm.$el.slideDown(200);
        },
        addDatabase: function(data){

            var newDatabase = new Nongo.Models.Database();

            newDatabase.save(null, {
                attrs: { name: data.name },
                success: function(model, response, options){
                    Nongo.app.navigate('/databases/' + data.name, { trigger: true });
                },
                error: function(model, xhr, options){
                    throw new Error('Collection not save');
                }
            });


        },
        closeShellForm: function(){
            var self = this;
            this.shellForm.$el.slideUp(200, function(){
                self.shellForm.remove();
            });
        }
    });
}());