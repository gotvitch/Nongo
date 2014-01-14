(function () {
    'use strict';


    Nongo.Views.IndexesItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.IndexesItem,
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

    Nongo.Views.Indexes = Backbone.Marionette.CompositeView.extend({
        template: Nongo.Templates.Indexes,
        itemView: Nongo.Views.IndexesItem,
        itemViewContainer: 'tbody',
        events: {
            'click .js-refresh': 'refresh',
            'click .js-add': 'showCreateIndex'
        },
        initialize: function(options){
            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;
            
            this.collection = new Nongo.Collections.Indexes({ databaseName: this.databaseName, collectionName: this.collectionName });
            this.collection.fetch({});
        },
        refresh: function(e){
            this.collection.fetch();
        },
        showCreateIndex: function(){
            this.shellForm = new Nongo.Views.ShellForm({
                cancel: true,
                config: 'db.ensureIndex',
                customBefore: ('db.' + this.collectionName + '.')
            });

            this.listenTo(this.shellForm, 'submit', this.createIndex, this);
            this.listenTo(this.shellForm, 'cancel', this.closeShellForm, this);

            this.shellForm.render();

            this.$('.shell-form-wrapper').html(this.shellForm.$el.hide());

            this.shellForm.$el.slideDown(200);
        },
        createIndex: function(data){

            var self = this;

            try {
                eval(data.keys);
            } catch (error) {
                alert('Fields parsing error.');
            }

            if(_.isEmpty(data.keys)){
                alert('Index key cannot be blank.');
            }


            var newIndex = new Nongo.Models.Index({ keys: data.keys }, { databaseName: this.databaseName, collectionName: this.collectionName });

            if(data.name){
                newIndex.set('name', data.name);
            }

            if(data.sparse){
                newIndex.set('sparse', data.sparse);
            }

            if(data.unique){
                newIndex.set('unique', data.unique);
            }

            // Remove the id to not consider as a existing index
            newIndex.id = null;

            newIndex.save({}, {
                success: function(model, response, options){
                    self.closeShellForm();
                    self.collection.fetch();
                },
                error: function(model, xhr, options){
                    throw new Error('Index not save');
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