(function () {
    'use strict';


    Nongo.Views.DocumentsItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.DocumentsItem,
        tagName: 'li',
        initialize: function(options){
            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;
        },
        serializeData: function () {
            var modelJSON = this.model.toJSON();

            return {
                databaseName: this.databaseName,
                collectionName: this.collectionName,
                _id: modelJSON._id,
                content: Nongo.Tool.BSON.toBsonString(modelJSON, {html: true})
            };
        }
    });

    Nongo.Views.Documents = Backbone.Marionette.CompositeView.extend({
        template: Nongo.Templates.Documents,
        itemView: Nongo.Views.DocumentsItem,
        itemViewContainer: '.documents',
        events: {
            'click .js-refresh': 'refresh',
            'click .js-add': 'showAddCollection'
        },
        itemViewOptions: function(model, index) {
            return {
                databaseName: this.databaseName,
                collectionName: this.collectionName
            };
        },
        initialize: function(options){

            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;

            this.collection = new Nongo.Collections.Documents({ databaseName: this.databaseName, collectionName: this.collectionName });

            this.collection.fetch({});
        },
        onRender: function(){
            this.shellForm = new Nongo.Views.ShellForm({ config: 'db.find', customBefore: ('db.' + this.collectionName + '.') });

            this.listenTo(this.shellForm, 'submit', this.runQuery, this);

            this.shellForm.render();

            this.$el.prepend(this.shellForm.$el.hide());

            this.shellForm.$el.slideDown(200);
        },
        runQuery: function(data){

            var query, fields, sort;

            try {
                query = JSON.stringify(Nongo.Tool.BSON.bsonEval(data.query.data()));
            } catch (error) {
                return false;
            }

            try {
                fields = JSON.stringify(Nongo.Tool.BSON.bsonEval(data.fields.data()));
            } catch (error) {
                return false;
            }

            try {
                sort = JSON.stringify(Nongo.Tool.BSON.bsonEval(data.sort.data()));
            } catch (error) {
                return false;
            }
            
            this.collection.fetch({ data: { query: query, fields: fields, sort: sort, skip: data.skip.data(), limit: data.limit.data() } });
        }
    });
}());