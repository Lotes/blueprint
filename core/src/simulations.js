(function () {
    var Promise = require('promise');
    var inherit = require('./inherit');

    /**
     * A runtime state consists of a certain input, state and output.
     * @method RuntimeState
     * @param input
     * @param state
     * @param output
     * @constructor
     */
    function RuntimeState(input, state, output) {
        var locked = false;
        if(input) {
            var readOnlyInput = input;
            Object.defineProperty(this, 'input', {
                get: function () { return readOnlyInput; }
            });
        }
    }

    function NodeRuntimeState(node, input, state, output) {
        NodeRuntimeState.__super__.constructor.apply(this, [input, state, output]);
    }
    inherit(NodeRuntimeState, RuntimeState);

    function ConnectionRuntimeState(connection, input, state, output) {
        ConnectionRuntimeState.__super__.constructor.apply(this, [input, state, output]);
    }
    inherit(ConnectionRuntimeState, RuntimeState);

    function ModuleInstanceRuntimeState(instance) {

    }

    //--------------------------------------------------------------

    function Simulator(moduleInstance) { 
    
    }
    Simulator.prototype = {
        reset: function () { },
        step: function () { },
        setInput: function (input) { },
        getState: function () { },
        setState: function (state) { },
        getOutput: function () { },
    };
    
    function xxx() {
        var app = blueprint.application();
        var IfThenElse = app.module('IfThenElse');
        var moduleInstance = new IfThenElse({ 
            //...parameters
        });
        var simulator = app.simulate(moduleInstance);
        simulator.reset();
        var input = simulator.createDefaultInput();
        input.nodes[1].nodes[2].enabled = true;
        input.submodule.button.enabled = true;
        simulator.setInput(input);
        simulator.step();
        var state = simulator.getState();
        state.connections[1].weight = 10;
        simulator.setState(state);
        var output = simulator.getOutput();
        var activation = output.neuron.activation;
    }
    
    module.exports = {
    
    };
})();