/*global window, document, Nongo, $, _, Backbone */
(function () {
    'use strict';

    Nongo.Layouts.App = Backbone.Marionette.Layout.extend({
        el: '#app',
        template: Nongo.Templates.App,
        regions: {
            content: '#content'
        },
        initialize: function () {
            return this.render();
        }
    });
}());