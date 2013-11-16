(function () {
    'use strict';


    Nongo.Views.DocumentsItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.DocumentsItem,
        tagName: function(){
            return this.model.isNew() ? 'div' : 'li';
        },
        className: 'document',
        events: {
            'click .js-edit': 'edit',
            'click .js-cancel': 'endEdit',
            'click .js-save': 'save'
        },
        initialize: function(options){
            // this.databaseName = this.options.databaseName || this.collection.databaseName;
            // this.collectionName = this.options.collectionName || this.collection.collectionName;
            this.mode = this.model.isNew() ? 'edit' : 'display';
            //this.listenTo(this.model, 'change',  this.render);
        },
        serializeData: function () {
            var modelJSON = this.model.toJSON();

            return {
                databaseName: this.databaseName,
                collectionName: this.collectionName,
                is_new: this.model.isNew(),
                _id: this.model.id,
                creationTime: this.model.getCreationTime(),
                content: Nongo.Tool.BSON.toBsonString(modelJSON, {html: true})
            };
        },
        onRender: function(){
            
            if(this.mode == 'edit'){

                var $documentWrapper = this.$('.document-wrapper');
                var documentWrapperHeight = $documentWrapper.height();

                var modelJSON = this.model.toJSON();

                var documentEditor = this.$el.find('.document-editor');


                var $textarea = $('<textarea></textarea>')

                var height;
                if(this.model.isNew()){
                    height = 350;
                    $textarea.text(Nongo.Tool.BSON.toBsonString(modelJSON, {html: false}));
                }else{
                    height = Math.max(180, Math.min(600, $documentWrapper.height() + 40))
                    $textarea.text(Nongo.Tool.BSON.toBsonString(modelJSON, {html: false}));
                }

                documentEditor.html($textarea);

                this.$el.find('.document-display').hide();

                this.editor = CodeMirror.fromTextArea($textarea[0], {
                    lineNumbers: true,
                    autofocus: true,
                    mode: 'application/json',
                    matchBrackets: true
                });

                
                this.editor.setSize(null, height);

                if(this.model.isNew()){
                    this.editor.setValue("{\n    \n}\n");
                    this.editor.setCursor({line: 1, ch: 4});
                }


            }else{
                this.$el.find('.document-edit').hide();
            }
        },
        edit: function(){
            this.mode = 'edit';
            this.render();
        },
        endEdit: function(){
            var self = this;

            if(this.model.isNew()){
                this.$el.slideUp(200, function(){
                    self.remove();
                })
                
            }else{
                //this.$('.document-edit').hide();
                //this.$('.document-display').show();

                this.editor.toTextArea();
                //this.$('.document-editor').html('');
                this.mode = 'display';
                this.render();
            }   
        },
        save: function(){
            var self = this;
            var editorValue = this.editor.getValue();

            var data = Nongo.Tool.BSON.bsonEval(editorValue);

            this.model.clear({silent: true});
            this.model.save(data, {
                success: function(model, response, options){
                    self.endEdit();
                    self.render();
                    debugger;
                    Nongo.app.navigate('/databases/' + model.databaseName + '/collections/' + model.collectionName + '/documents/' + model.id, { trigger: true });
                },
                error: function(model, xhr, options) {
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
            'click .js-add': 'add'
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
            this.documentId = this.options.documentId;

            this.collection = new Nongo.Collections.Documents({ databaseName: this.databaseName, collectionName: this.collectionName });


            //this.collection.fetch({});
        },
        onDomRefresh: function(){
            this.shellForm = new Nongo.Views.ShellForm({ config: 'db.find', customBefore: ('db.' + this.collectionName + '.') });

            this.listenTo(this.shellForm, 'submit', this.runQuery, this);

            this.shellForm.render();

            this.$el.prepend(this.shellForm.$el);

            if(this.documentId){
                this.showDocument(this.documentId)
                this.documentId = null;
            }else{
                this.runQuery();
            }
        },
        showDocument: function(documentId){
            this.shellForm.set({ query: documentId });
            this.runQuery();
        },
        add: function(){
            var addDocumentView = new Nongo.Views.DocumentsItem({ model: new Nongo.Models.Document({}, { collection: this.collection }) } );
            
            this.$('.document-new').prepend(addDocumentView.el)
            addDocumentView.render();
            addDocumentView.edit();

            this.$('.document-new').hide()

            this.$('.document-new').slideDown(200);
        },
        runQuery: function(){
            var data = this.shellForm.fields;
            var query, fields, sort;
            var queryData = data.query.data();


            var objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

            if(queryData.length == 26 && objectIdRegex.test(queryData.substring(1, 25))){
                queryData = '{ _id: ObjectId("' + queryData.substring(1, 25) + '") }';
            }

            try {
                query = JSON.stringify(Nongo.Tool.BSON.bsonEval(queryData));
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
            
            this.lastQuery = { query: query, fields: fields, sort: sort, skip: data.skip.data(), limit: data.limit.data() };

            this.collection.fetch({ data: this.lastQuery });
        },
        refresh: function(){
            this.collection.fetch({ data: this.lastQuery });
        }
    });

}());