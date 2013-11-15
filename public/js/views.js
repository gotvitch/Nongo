(function () {
    'use strict';

    Nongo.Views.ShellForm = Backbone.Marionette.ItemView.extend({
        events: {
            'click button[data-field]': 'toggleButton',
            'focus span[contentEditable]': 'focusField',
            'blur span[contentEditable]': 'blurField',
            'click .js-submit': 'submit',
            'click .js-cancel': 'cancel'
        },
        filler: '\u200B',
        className: 'shell-form',
        initialize: function(options){
            this.fields = {};
            this.config = Nongo.ShellFormConfig[this.options.config];
            this.customBefore = this.options.customBefore;

            return this;
        },
        render: function(params) {
            this.$params = $('<div class="params">');
            this.$buttons = $('<div class="buttons clearfix">');

            this.$params.append('<span>' + this.customBefore + '</span>');
            this.fields = {};
            _.each(this.config.fields, function(field) {
                this.addFields(new Field(field));
            }, this);

            
            this.$actions = $('<div class="action pull-right">');
            if(this.options.cancel){
                this.$actions.append($('<button class="btn btn-default js-cancel">Cancel</buttons>'));
                this.$actions.append(' ');
            }

            this.$actions.append($('<button class="btn btn-primary js-submit">' + this.config.submit.value + '</buttons>'));
            
            this.$buttons.append(this.$actions);

            this.$el.html('');
            this.$el.append(this.$params);
            this.$el.append(this.$buttons);

            return this;
        },
        addFields: function(field){

            this.fields[field.name] = field;

            if(!field.isChild){
                this.$params.append(field.el);
            }
            if(!field.subFields && field.button){
                field.button = $('<button class="btn btn-default btn-sm" data-field="' + field.name + '">' + field.button + '</buttons>');
                this.$buttons.append(field.button);
                this.$buttons.append(' ');
            }

            if(field.childrens){
                _.each(field.childrens, function(child){
                    this.addFields(child);
                }, this);
            }
        },
        toggleButton: function(e) {
            var field;
            e.preventDefault();
            field = this.fields[$(e.target).attr('data-field')];
            return this.toggleField(field);
        },
        toggleField: function(field, value) {

            var f, parentField, r, show,
            _this = this;
            if (!_.isEmpty(value) && value !== false) {
                show = true;
            } else if (value === false) {
                show = false;
            } else {
                show = !field.el.is(':visible');
            }
            parentField = field.el.parents('.optional');
            if (show) {
                if (!_.isEmpty(parentField)) {
                    parentField.attr('style', '');
                }
                field.el.attr('style', '');
                if (!_.isEmpty(field.input)) {
                    if (value !== true) {
                        field.input.text(value);
                    }
                    if (field.hint) {
                        this.toggleHint(field);
                    }
                }
                if (field.requires && !this.fields[field.requires].el.is(':visible')) {
                    r = {};
                    r[field.requires] = true;
                    this.set(r);
                    f = field.requires;
                    f = f[0].toUpperCase() + f.substr(1, f.length);
                    //notify.normal("" + f + " is required with " + field.name);
                }
            } else {
                field.el.hide();
                if (!(!_.isEmpty(parentField) ? parentField.children(':visible').length : void 0)) {
                    if (!_.isEmpty(parentField)) {
                        parentField.hide();
                    }
                }
                _.each(this.dependentFields(field), function(name) {
                    var d;
                    d = {};
                    d[name] = false;
                    return _this.set(d);
                });
            }
            if (field.button) {
                field.button.toggleClass('active', show);
            }
            if (field.input) {
                field.input.focus();
            }
            return field.el;
        },
        dependentFields: function(field) {
            var data, dependent, f, _ref;
            dependent = [];
            _ref = this.fields;
            for (f in _ref) {
                data = _ref[f];
                if (data.requires === field.name) {
                    dependent.push(data.name);
                }
            }
            
            return dependent;
        },
        set: function(params) {
            _.each(params, function(value, key) {
                if (this.fields[key]) {
                    this.toggleField(this.fields[key], value);
                }
            }, this);
            return this.fields;
        },
        get: function() {
            var data, field, fields, _ref;
            fields = {};
            _ref = this.fields;
            for (field in _ref) {
                data = _ref[field];
                if (!data.children) {
                    fields[field] = data.val();
                }
            }
            return fields;
        },
        text: function() {
            var text,
            _this = this;
            text = '';
            _.each(this.fields, function(v, k) {
                if (_this.fields[k].name && !_this.fields[k].isChild) {
                    return text += _this.fields[k].fullText().replace(/\\u200B/, '');
                }
            });
            return text;
        },
        focusField: function(e) {
            var el, field;
            el = $(e.target);
            field = this.fields[el.attr('data-name')];
            if (field.placeholder) {
                if (el.text() === field.placeholder) {
                    el.text(this.filler);
                }
            }
            
            return this.caretToEnd(e);
        },
        blurField: function(e) {
            var el, field;
            el = $(e.target);
            field = this.fields[el.attr('data-name')];
            if (field.placeholder) {
                if (el.text() === this.filler || el.text() === '') {
                    el.text(field.placeholder).addClass('placeholder');
                } else {
                    el.removeClass('placeholder');
                }
            }
            if (el.text() === '') {
                return el.text(this.filler);
            }
        },
        caretToEnd: function(event) {
            return $(event.target).caret($(event.target).text().length);
        },
        submit: function(e){
            this.trigger('submit', this.fields);
        },
        cancel: function(e){
            this.trigger('cancel');
        }
        
    });

    var Field = function(options, isChild) {
        
        _.each(options, function(value, key){
            this[key] = value;
        }, this);

        if (isChild === undefined) {
            isChild = false;
        }

        this.isChild = isChild;
        if (this.text && this.isChild) {
            this['class'] += ' text';
        }

        this.el = $('<span>').addClass(this['class']).append(this.before, this.text);

        if (this.optional) {
            this.el.addClass('optional');
        }
        if (this.subFields) {
            this.childrens = [];

            _.each(this.subFields, function(child){
                var childField = new Field(child, true);

                this.childrens.push(childField);
                this.el.append(childField.el);
            }, this);
            
        } else {
            this.visible = !this.button || this.visible === true || this.value !== '';
            this.initialValue = this.visible && this.text === '' ? this.value : this.visible;
            if (!this.visible) {
                this.el.hide();
            }
            if (this.text === '') {
                this.input = $('<span spellcheck="false" contentEditable="true" data-type="' + this.type + '" data-name="' + this.name + '">');
                this.input.text(this.initialValue || this.placeholder || this.filler);
                if (this.placeholder) {
                    this.input.addClass('placeholder');
                }
                this.el.append(this.input);
            }
        }

        this.el.append(this.after);
        if (this.optional) {
            this.el.hide();
        }

        return this;
    };

    _.extend(Field.prototype, {
        filler: '\u200B',
        name: false, // Name of field
        value: '',  // Value by default
        text: '', // Text to display if the field is type text
        before: '', // Before the field
        after: '', // After the field
        'class': '', // ???
        visible: false,
        button: false, // Button associate to the field
        hint: false, // ???
        placeholder: '', // Placeholder for text
        subFields: false, // Group of fields
        type: 'text',
        optional: false,
        requires: false, // Dependency

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function(){},

        fullText:  function() {

            if(this.subFields){
                if (this.type === 'hash') {
                    return '{ ' + _.compact(_.map(this.childrens, function(child){ return child.getText(); })).join(',') + ' }';

                } else {
                    return this.before + _.compact(_.map(this.childrens, function(child){ return child.fullText(); })).join(',') + this.after;
                }
            }else{
                if (this.isVisible()) {
                    return this.before + this.getText() + this.after;
                } else {
                    return '';
                }
            }
        },
        data: function() {
            if(this.subFields){
                return this.fullText();
            }else{
                if (this.type === 'hash') {
                    return '{' + (this.val() || '') + '}';
                } else {
                    return this.val();
                }
            }
        },
        isVisible: function() {
            if(this.subFields){
                return;
            }

            return this.el.is(':visible');
        },
        getText: function() {
            if(this.subFields){
                return;
            }

            if (this.isVisible() && this.text) {
                return this.text;
            } else {
                return this.val();
            }
        },
        val: function() {
            var t;
            if (!_.isEmpty(this.input) && this.isVisible()) {
                t = this.input.text().replace('\u200B', '');
                if (this.placeholder) {
                    t = t.replace(new RegExp('^ *' + this.placeholder + ' *$'), '');
                }
                return t;
            } else {
                return this.isVisible();
            }
        }
    });

    Nongo.ShellFormConfig = {
        'db.copyDatabase': {
            fields: [
                {
                    name: 'copyDatabase',
                    before: 'db.copyDatabase(',
                    after: ')',
                    subFields: [
                        {
                            name: 'remote_db_name',
                            before: '',
                            after: '',
                            type: 'text',

                        },
                        {
                            name: 'local_db_name',
                            before: ', ',
                            after: '',
                            type: 'text'
                        },
                        {
                            name: 'from_host_name',
                            before: ', ',
                            after: '',
                            button: 'hostname',
                            type: 'text'
                        },
                        {
                            name: 'username',
                            before: ', ',
                            after: '',
                            button: 'username',
                            placeholder: 'username',
                            type: 'text'
                        },
                        {
                            name: 'password',
                            before: ', ',
                            after: '',
                            button: 'password',
                            type: 'text'
                        }
                    ]
                }
            ],
            submit: {
                value: 'Run',
                'class': 'run'
            }
        },
        'db.createCollection': {
            fields: [
                {
                    name: 'name',
                    before: 'db.createCollection("',
                    after: '"',
                    placeholder: 'name'
                },
                {
                    name: 'capped',
                    before: ', { capped: true',
                    after: '}',
                    optional: true,
                    subFields: [
                        {
                            name: 'size',
                            before: ', size: ',
                            button: 'size'
                        },
                        {
                            name: 'max',
                            before: ', max: ',
                            button: 'max',
                            requires: 'size'
                        }
                    ]
                },
                {
                    text: ')'
                }
            ],
            submit: {
                value: 'Create collection',
                'class': 'run'
            }
        },
        'db.find': {
            fields: [
                {
                    name: 'find',
                    before: 'find(',
                    after: ')',
                    subFields: [
                        {
                            name: 'query',
                            before: '{',
                            after: '}',
                            type: 'hash'
                        },
                        {
                            name: 'fields',
                            before: ',{',
                            after: '}',
                            button: 'fields{}',
                            type: 'hash'
                        }
                    ]
                },
                {
                    name: 'sort',
                    before: '.sort({',
                    after: '})',
                    button: 'sort()',
                    type: 'hash'
                },
                {
                    name: 'skip',
                    before: '.skip(',
                    after: ')',
                    button: 'skip()',
                    type: 'number'
                },
                {
                    name: 'limit',
                    before: '.limit(',
                    after: ')',
                    type: 'number',
                    value: 10
                },
                {
                    name: 'explain',
                    text: '.explain()',
                    button: 'explain()'
                }
            ],
            submit: {
                value: 'Run',
                'class': 'run'
            }
        }
    };
}());
(function () {
    'use strict';

    Nongo.Views.App = Backbone.Marionette.Layout.extend({
        el: 'body',
        //template: Nongo.Templates.App,
        regions: {
            content: '#content'
        },
        initialize: function () {
            //return this.render();
        },
        showHome: function(){
            var self = this,
                databases = new Nongo.Collections.Databases({});

            databases.fetch({
                success: function () {
                    self.content.show(new Nongo.Views.Home({
                        collection: databases
                    }));
                }
            });
        },
        showTest: function(){
            

            //this.content.show());
        },
        showDatabase: function(databaseName){
            var databaseView = new Nongo.Views.Database({ databaseName: databaseName });
            
            this.content.show(databaseView);

            databaseView.showCollections();
        },
        showCollection: function (databaseName, collectionName) {
            var collectionView = new Nongo.Views.Collection({ databaseName: databaseName, collectionName: collectionName });
            this.content.show(collectionView);
            collectionView.showDocuments();
        }
    });
}());
(function () {
    'use strict';


    Nongo.Views.Collection = Backbone.Marionette.Layout.extend({
        template: Nongo.Templates.Collection,
        regions: {
            content: '#collection-content'
        },
        initialize: function (options) {
            this.databaseName = this.options.databaseName;
            this.collectionName = this.options.collectionName;
        },
        showDocuments: function(){
            var documentsView = new Nongo.Views.Documents({ databaseName: this.databaseName, collectionName: this.collectionName });
            this.content.show(documentsView);
        }
    });
}());
(function () {
    'use strict';


    Nongo.Views.CollectionsItem = Backbone.Marionette.ItemView.extend({
        template: Nongo.Templates.CollectionsItem,
        tagName: 'tr',
        initialize: function(options){
            this.databaseName = this.options.databaseName;
        },
        serializeData: function () {
            var modelJSON = this.model.toJSON();

            return _.extend(modelJSON, {
                databaseName: this.databaseName
            });
        }
    });

    Nongo.Views.Collections = Backbone.Marionette.CompositeView.extend({
        template: Nongo.Templates.Collections,
        itemView: Nongo.Views.CollectionsItem,
        itemViewContainer: 'tbody',
        events: {
            'click .js-refresh': 'refresh',
            'click .js-add': 'showAddCollection'
        },
        itemViewOptions: function(model, index) {
            return {
                databaseName: this.databaseName
            };
        },
        initialize: function(options){

            this.databaseName = this.options.databaseName;

            this.collection = new Nongo.Collections.Collections({ databaseName: this.databaseName});

            this.collection.fetch({});

        },
        refresh: function(e){
            this.collection.fetch();
        },
        showAddCollection: function(){
            this.shellForm = new Nongo.Views.ShellForm({
                cancel: true,
                config: 'db.createCollection'
            });

            this.listenTo(this.shellForm, 'submit', this.addCollection, this);
            this.listenTo(this.shellForm, 'cancel', this.closeShellForm, this);

            this.shellForm.render();

            this.$el.prepend(this.shellForm.$el.hide());

            this.shellForm.$el.slideDown(200);
        },
        addCollection: function(data){

            var self = this,
                size = parseInt(data.size, null),
                max = parseInt(data.max, null);

            var collection = new Nongo.Models.Collection({ name: data.name }, { databaseName: this.databaseName });

            if(size){
                collection.set('size', size);
            }

            if(size && max){
                collection.set('max', max);
            }

            collection.save({}, {
                success: function(model, response, options){
                    Nongo.app.navigate('/databases/' + self.databaseName + '/collections/' + data.name, { trigger: true });
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
(function () {
    'use strict';


    Nongo.Views.Database = Backbone.Marionette.Layout.extend({
        template: Nongo.Templates.Database,
        regions: {
            content: '#database-content'
        },
        initialize: function (options) {
            this.databaseName = this.options.databaseName;
        },
        showCollections: function(){
            var collectionsView = new Nongo.Views.Collections({ databaseName: this.databaseName });
            this.content.show(collectionsView);
        }
    });
}());


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
