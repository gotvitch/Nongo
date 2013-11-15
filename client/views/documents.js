(function () {
    'use strict';


    Nongo.Views.DocumentsItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.DocumentsItem,
        tagName: 'li',
        className: 'document',
        events: {
            'click .js-edit': 'edit',
            'click .js-cancel': 'endEdit',
            'click .js-save': 'save'
        },
        initialize: function(options){
            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;
            //this.listenTo(this.model, 'change',  this.render);
        },
        serializeData: function () {
            var modelJSON = this.model.toJSON();

            return {
                databaseName: this.databaseName,
                collectionName: this.collectionName,
                _id: this.model.id,
                creationTime: this.model.getCreationTime(),
                content: Nongo.Tool.BSON.toBsonString(modelJSON, {html: true})
            };
        },
        onRender: function(){
            this.$el.find('.document-edit').hide();
        },
        edit: function(){

            var $documentWrapper = this.$('.document-wrapper');
            var height = Math.max(180, Math.min(600, $documentWrapper.height() + 40));

            var modelJSON = this.model.toJSON();

            var documentEditor = this.$el.find('.document-editor');

            var textarea = $('<textarea></textarea>').text(Nongo.Tool.BSON.toBsonString(modelJSON, {html: false}));

            documentEditor.html(textarea);

            this.$el.find('.document-edit').show();
            this.$el.find('.document-display').hide();

            this.editor = CodeMirror.fromTextArea(textarea[0], {
                lineNumbers: true,
                autofocus: true,
                mode: 'application/json'
            });
            this.editor.setSize(null, height);
        },
        endEdit: function(){

            this.$('.document-edit').hide();
            this.$('.document-display').show();

            this.editor.toTextArea();
            this.$('.document-editor').html('');
    
        },
        save: function(){
            var self = this;
            var editorValue = this.editor.getValue();

            var data = Nongo.Tool.BSON.bsonEval(editorValue);

            this.model.clear({silent: true});
            this.model.save(data, {
                success: function(){
                    self.endEdit();
                    self.render();
                },
                error: function(doc, xhr) {
                    throw new Error('TODO');
                }
            });
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
        onDomRefresh: function(){
            this.shellForm = new Nongo.Views.ShellForm({ config: 'db.find', customBefore: ('db.' + this.collectionName + '.') });

            this.listenTo(this.shellForm, 'submit', this.runQuery, this);

            this.shellForm.render();

            this.$el.prepend(this.shellForm.$el);

            // var codeTextarea = this.$el.find('#code');

            // //debugger;

            // var editor_json = CodeMirror.fromTextArea(codeTextarea[0], {
            //     lineNumbers: true,
            //     mode: "application/json"
            //   });




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