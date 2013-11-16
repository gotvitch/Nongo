(function () {
    'use strict';

    Nongo.Views.ShellForm = Backbone.Marionette.ItemView.extend({
        events: {
            'keypress span[contentEditable]': 'checkForEnter',
            'keydown span[contentEditable]': 'checkPaste',
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
            this.clipboard = $('<textarea class="clipboard">').attr('style', 'opacity: 0; position: absolute;');

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
        checkForEnter: function(e) {
            if (e.keyCode === 13) {
                this.submit(e);
                return false;
            }
        },
        checkPaste: function(e) {
            if (e.keyCode === 86 && (e.metaKey || event.ctrlKey)) {
                return this.catchClipboard(e);
            }
        },
        catchClipboard: function(e) {

            var caret, el, end, text,
            self = this;

            return _.delay(function(){

                el = $(e.target);
                caret = el.caret();
                text = el.text();
                end = text.length - caret.start - caret.length;
                self.clipboard.val(text);
                self.clipboard.focus().caret(caret);
                text = self.clipboard.val();
                el.text(text);
                el.focus().caret(text.length - end);
                return self.clipboard.val('');

            }, 30);
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