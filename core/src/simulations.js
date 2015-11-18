(function () {
    var Promise = require('promise');
    var inherit = require('./inherit');

    function Simulator(moduleInstance) { 
    
    }
    Simulator.prototype = {
        reset: function () { },
        step: function () { },
        setInput: function (input) { },
        getState: function () { },
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