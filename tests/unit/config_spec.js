/*jshint unused:false */
var should       = require('should'),
    configLoader = require('./../../server/lib/configLoader');


describe('Config', function () {

    describe('default value', function() {
        it('should load values', function (done) {
            configLoader.load().then(function (config) {
                config.should.have.property('db');
                config.db.should.have.property('hostname', 'localhost');
                config.db.should.have.property('port', 27017);

                config.should.have.property('server');
                config.server.should.have.property('hostname', 'localhost');
                config.server.should.have.property('port', 8081);

                done();
            }).fail(done);
        });
    });

    describe('command value', function() {
        before(function() {
            process.argv = [
                'node',
                'file.js',
                '--host',
                'hostcmd',
                '--port',
                '12345',
                '--webhost',
                'webhostcmd',
                '--webport',
                '54321'
            ];
        });

        it('should load values', function(done) {
            configLoader.load().then(function (config) {
                config.should.have.property('db');
                config.db.should.have.property('hostname', 'hostcmd');
                config.db.should.have.property('port', 12345);

                config.should.have.property('server');
                config.server.should.have.property('hostname', 'webhostcmd');
                config.server.should.have.property('port', 54321);

                done();
            }).fail(done);
        });

        after(function() {
            process.argv = [];
        });
    });

    describe('file value', function() {
        before(function() {
            process.argv = [
                'node',
                'file.js',
                '--config',
                './tests/unit/fixtures/config.js'
            ];
        });

        it('should load values', function(done) {
            configLoader.load().then(function (config) {
                config.should.have.property('db');
                config.db.should.have.property('hostname', 'file_db_hostname');
                config.db.should.have.property('port', 56789);

                config.should.have.property('server');
                config.server.should.have.property('hostname', 'file_server_hostname');
                config.server.should.have.property('port', 98765);

                done();
            }).fail(done);
        });

        after(function() {
            process.argv = [];
        });
    });
});