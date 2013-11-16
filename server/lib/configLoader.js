var command = require('commander').Command,
    path    = require('path'),
    Q       = require('q');


exports.load = function () {
    var config,
        configFile,
        configFilePath,
        program = new command(),
        deferred = Q.defer();

    program
        .version('0.0.1')
        .option('--hostname [hostname]', 'Server to connect to')
        .option('--port [port]', 'Port to connect to', parseInt)
        .option('-c, --config [file]', 'Config file path')
        .option('--whostname [hostname]', 'Hostname for the website')
        .option('--wport [port]', 'Port for the website', parseInt)
        .parse(process.argv);


    config = {
        db: {
            hostname: 'localhost',
            port: 27017
        },
        server: {
            hostname: 'localhost',
            port: 8081
        }
    };

    if(program.config){

        configFilePath = path.resolve(process.cwd(), program.config);

        try {
            configFile = require(configFilePath);
        } catch (ignore) {
        }

        if (!configFile) {
            deferred.reject(new Error('Cannot find the configuration file.'));
        }

        if(configFile.db && configFile.db.hostname){
            config.db.hostname = configFile.db.hostname;
        }

        if(configFile.db && configFile.db.port){
            config.db.port = configFile.db.port;
        }

        if(configFile.server && configFile.server.hostname){
            config.server.hostname = configFile.server.hostname;
        }

        if(configFile.server && configFile.server.port){
            config.server.port = configFile.server.port;
        }

    }else{
        if(program.hostname){
            config.db.hostname = program.hostname;
        }

        if(program.port){
            config.db.port = program.port;
        }

        if(program.whostname){
            config.server.hostname = program.whostname;
        }

        if(program.wport){
            config.server.port = program.wport;
        }
    }

    deferred.resolve(config);

    return deferred.promise;
};
