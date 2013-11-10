/*globals window, $, _, Backbone, Validator */
(function () {
    'use strict';

    var Nongo = {
        Layout      : {},
        Views       : {},
        Collections : {},
        Models      : {},
        Templates   : {}
    };

    _.extend(Nongo, Backbone.Events);

    window.Nongo = Nongo;

}());
