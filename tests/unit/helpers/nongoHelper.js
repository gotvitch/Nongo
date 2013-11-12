var Nongo            = require('../../../server/nongo'),
    configLoader     = require('../../../server/lib/configLoader'),
    Server           = require('../../../server/index');



module.exports = {
    startServer: function(){
        var server;

        return configLoader.load()
            .then(function (config) {
                return Nongo.init(config);
            })
            .then(function () {
                server = new Server();
                return server.start();
            })
            .then(function () {
                return server;
            });
    }
};