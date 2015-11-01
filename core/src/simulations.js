(function () {
    function ModuleState() { }

    function Simulation() { 
    
    }
    Simulation.prototype = {
        reset: function () { }, //promise
        step: function() { } //promise
    };
    
    function Simulator() { 
        //reset
    }
    function LocalSimulator() { }
    function WorkerSimulator() { }
    function RemoteSimulator() { }
    
    module.exports = {
    
    };
})();