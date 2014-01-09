(function () {
    'use strict';

    var Nongo = {
        Layouts     : {},
        Views       : {},
        Collections : {},
        Models      : {},
        Templates   : {}
    };

    _.extend(Nongo, Backbone.Events);

   // _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

    window.Nongo = Nongo;

    $(function () {
        Nongo.appView = new Nongo.Views.App();
        Nongo.app = new Nongo.Router();

        $(document).on('click', 'a[data-link=push]', function (event) {
            if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                event.preventDefault();
                var url = $(event.currentTarget).attr('href');

                return Nongo.app.navigate(url, { trigger: true });
            }
        });
        
        Backbone.history.start({ pushState: true });
        
    });
}());
