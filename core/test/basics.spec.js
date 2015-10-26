var should = require('should');
var basics = require('../src/basics');

describe('Basics', function () {
    it('should create an empty module', function () {
        var Empty = new basics.Module({ builder: function () { } });
        var empty = new Empty();
        empty.nodes.length.should.be.exactly(0);
        empty.connections.length.should.be.exactly(0);
    });

    it('should fail creating module when builder is missing', function () {
        (function () {
            new basics.Module({});
        }).should.throw();
    });
});