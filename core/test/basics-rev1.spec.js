var should = require('should');
var basics = require('../src/basics-rev1');

describe('Basics', function () {
    it('should create an empty module', function () {
        var Empty = new basics.Module({ builder: function () { } });
        var empty = new Empty();
        empty.nodes.length.should.be.exactly(0);
        empty.connections.length.should.be.exactly(0);
    });

    it('should fail creating module when builder is missing', function () {
        (function () {
            new basics.Module();
        }).should.throw();
    });
    
    it('should create a Neuron', function () {
        var options = {
            type: basics.NeuronType.ACTIVATE, 
            threshold: 2,
            maximum: 3,
            factor: 4,
            associateConstant: 5,
            disassociateConstant: 6,
        };
        var neuron = new basics.Neuron(options);
        neuron.should.have.properties(options);
    });

    it('should fail creating Neurons', function () {
        (function () { new basics.Neuron(); }).should.throw();
        (function () { new basics.Neuron({ type: basics.NeuronType.ACTIVATE, threshold: -1 }); }).should.throw();
        (function () { new basics.Neuron({ type: basics.NeuronType.ACTIVATE, factor: -1 }); }).should.throw();
        (function () { new basics.Neuron({ type: basics.NeuronType.ACTIVATE, maximum: -1 }); }).should.throw();
        (function () { new basics.Neuron({ type: basics.NeuronType.ACTIVATE, associateConstant: -1 }); }).should.throw();
        (function () { new basics.Neuron({ type: basics.NeuronType.ACTIVATE, disassociateConstant: -1 }); }).should.throw();
    });

    it('should create a neuron module', function () {
        var Delay = new basics.Module({
            builder: function (options, self) {
                var start = this.add(new basics.Neuron({ type: basics.NeuronType.ACTIVATE }));
                var neuron = start;
                for (var index = 0; index < options.count-1; index++) {
                    var next = this.add(new basics.Neuron({ type: basics.NeuronType.ACTIVATE }));
                    this.connect(neuron, next);
                    neuron = next;
                }   
            }
        });
        var delay = new Delay({ count: 3 });
        delay.nodes.length.should.be.exactly(3);
        delay.connections.length.should.be.exactly(2);
    });
});