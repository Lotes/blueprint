(function() {
	/*
	TODO:
		- wie Events innerhalb einer Modulistanz weitergeben?
		- wo ist die interne Struktur für alle anderen Prozesse (Layout, Simulation, Serialisierung)?
            - durch Instanziierung eines Moduls - in der Modulinstanz
		
		var IfThenElseModule = new Blueprint.Module({
			builder: function(options) {
				var thenBranch = this.add(new Blueprint.Neuron({
					type: Blueprint.NeuronType.ACTIVATE,
					...
				}));
				thenBranch.on('activate', function() {
					this.trigger('then');
				});
                this.register('thenBranch', thenBranch);
				...
			}
		});
        ...
        var ifThenElse = this.add(new IfThenElseModule());
        this.connect(ifThenElse.thenBranch, act123
	*/
	
	var extend = require('./extend');
	
	/**
	 * @class Object
	 * @constructor
     * @private
	 */
	function Object() {
		_.extend(this, Backbone.Events);
	}
	
    /**
	 * @event tick
	 * @param object {Object}
	 */
	var EVENT_TICK = 'tick';

	/**
	 * @class ModuleBuilder
	 * @constructor
     * @private
	 */
	function ModuleBuilder() {
        this.result = new ModuleInstance();
        this.finished = false;
	}
	ModuleBuilder.prototype = {
		/**
		 * Adds a node to the module instance.
		 * @method add
		 * @param nodeInstance {Node} any concrete node instance
         * @todo implement me
		 */
		add: function(nodeInstance) {
            if (this.finished === true)
                throw new Error('Module instance was already completely built. You can not change it anymore!');
		},
		/**
		 * groups a set of nodes under a unique name
		 * @method group
		 * @param nodeList {Array<Node>} a list of nodes
		 * @return {Group} a Group node instance
		 */
		group: function(nodeList) {
			return this.add(Group, { nodes: nodeList });
		},
		/**
		 * Connect two nodes with each other. Returns more than one connection if source or destination contains groups.
		 * Throws an error if at least one connection is not allowed!
		 * @method connect
		 * @param source {Node} the source node
		 * @param destination {Node} the destination node
		 * @return {Array<Connection>} a set of created connections
		 * @throws {Error} if at least one connection is not allowed
         * @todo implement me
		 */
		connect: function(source, destination) {
			//return connections
		},
		/**
		 * Ends building the constructed module instance. Surpresses future builder calls!
		 * @method end
         * @todo implement me
		 */
		end: function() { this.finished = true; },
		setDefaultSender: function(sourceNode) {}, //TODO
		setDefaultReceiver: function(destinationNode) {}, //TODO
		register: function(name, node) {}
	};
	
	/**
	 * @class Module
     * @constructor
	 * @param options.builder {function(options)} a function with a passed module 
	 *        builder as `this` object to construct the module. The options parameter 
	 *        corresponds to the one of the ModuleInstance node constructor. 
     * @todo add other options, like template url or gui controller
	 */
	function Module(options) {
		if(typeof(options.builder) !== 'function')
			throw new Error('The "builder" option must be a function!');
        function construct(options) {
            var builder = new ModuleBuilder();
            options.builder.call(builder, options);
            builder.end();
            var result = builder.getResult();
            result.options = options;
            return result;
        }
        return construct;
	}
	
	/**
	 * @class Node
	 * @constructor
     * @private
	 * @param options {object}
	 * @extends Object
	 */
	function Node() {
		//initialize node
		Node.__super__.constructor.apply(this, arguments);
	}
	Node.prototype = {};
	extend(Node, Object);
    
    /**
     * @class ModuleInstance
     * @constructor
     * @private
     * @extends Node
     */
    function ModuleInstance() {
        ModuleInstance.__super__.constructor.apply(this, arguments);
        this.options = {};
        this.nodes = []; 
        this.connections = [];
    }
    extend(ModuleInstance, Node);
	
	module.exports = {
        Module: Module,
        Node: Node,
        EVENT_TICK: EVENT_TICK,
	};
})();