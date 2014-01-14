(function () {
    'use strict';
    Handlebars.registerHelper('humanizeByte', function (bytes) {

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        if (bytes === 0) {
            return 'n/a';
        }
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), null);
        if (i === 0) {
            return bytes + ' ' + sizes[i];
        }

        var size = (bytes / Math.pow(1024, i));

        return (Math.round(size * 100) / 100) + ' ' + sizes[i];
    });

    Handlebars.registerHelper('humanizeCount', function (count) {

        var suffix = '';
        count = count || 0;

        if (count > 1000) {
            count  = Math.floor(count / 1000);
            suffix = ' k';
        }

        if (count > 1000) {
            count  = Math.floor(count / 1000);
            suffix = ' M';
        }

        if (count > 1000) {
            return '...';
        }

        return count + suffix;
    });


    Handlebars.registerHelper('stringify', function (value) {
        return JSON.stringify(value);
    });

    Handlebars.registerHelper('yesno', function (value) {
        return value ? 'Yes' : 'No';
    });
    
}());
