var should       = require('should'),
    Nongo = require('./../../server/nongo');

describe('Nongo', function () {

    before(function (done) {
        Nongo.init({
            db: {
                hostname: 'localhost',
                port: 27017
            },
            server: {
                hostname: 'localhost',
                port: 8080
            }
        }).then(function () {
            done();
        }, done);
    });

    it('is a singleton', function () {
        var nongo1 = require('./../../server/nongo');
        var nongo2 = require('./../../server/nongo');

        should.strictEqual(nongo1, nongo2);
    });
});