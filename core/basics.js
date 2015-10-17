(function() {
	/*
	TODO:
		- wie Events innerhalb einer Modulistanz weitergeben?
		- 
	*/
	
	var extend = require('./extend');
	
	/**
	 * @class Object
	 * @constructor
	 * @namespace internal
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
	 */
	function ModuleBuilder() {
		this.result = null;
	}
	ModuleBuilder.prototype = {
		/**
		 * Adds a node of the given type with a unique name to the module instance.
		 * @method add
		 * @param name {String} the unique name of the node within the module
		 * @param typeConstructor {Node|Module} the type of node which shall be instantiated (could also be a module)
		 * @param options {object} constructor parameters for the given type
		 * @return {Node} a specialized Node instance
		 */
		add: function(name, typeConstructor, options) {
			//return node instance
		},
		/**
		 * groups a set of nodes under a unique name
		 * @method group
		 * @param name {String} the unique name of the node within the module
		 * @param nodeList {Array<Node>} a list of nodes
		 * @return {Group} a Group node instance
		 */
		group: function(name, nodeList) {
			return this.add(name, Group, { nodes: nodeList });
		},
		/**
		 * Connect two nodes with each other. Returns more than one connection if source or destination contains groups.
		 * Throws an error if at least one connection is not allowed!
		 * @method connect
		 * @param source {Node} the source node
		 * @param destination {Node} the destination node
		 * @return {Array<Connection>} a set of created connections
		 * @throws {Error} if at least one connection is not allowed
		 */
		connect: function(source, destination) {
			//return connections
		},
		/**
		 * Returns the constructed module instance.
		 * @method getResult
		 * @return {ModuleInstance} 
		 */
		getResult: function() { return this.result; }
	};
	
	/**
	 * @class Module
	 * @constructor
	 * @param instantiate {Function(options)} a function with a passed module 
	 *        builder as `this` object to construct the module. The options parameter 
	 *        corresponds to the one of the ModuleInstance node constructor. 
	 */
	function Module(instantiate) {
		//checking parameters
		if(typeof(instantiate) !== 'function')
			throw new Error('First parameter must be a function!');
		//initialize
		this.instantiate = instantiate;
	}
	
	/**
	 * @class Node
	 * @constructor
	 * @param options {object}
	 * @extends Object
	 * @namespace internal
	 */
	function Node(options) {
		//checking parameters
		options = options || {};
		var label = options.label || '';
		if(typeof(label) !== 'string')
			throw new Error('Option `label` must be a string!');
		var parentModule = options.parentModule || null;
		if(typeof(parentModule) !== 'object' || (parentModule != null && !(parentModule instanceof Module)))
			throw new Error('Option `parentModule` must be a Module instance or null!');
		
		//initialize node
		Node.__super__.constructor.apply(this, arguments);
		this.parentModule = parentModule;
		this.label = label;
	}
	Node.prototype = {
		//getInputNodes(): Node[]
		//getOutputNodes(): Node[]
		//getInputConnections(): Connection[]
		//getOutputConnections() :Connection[]
	};
	extend(Node, Object);
	
	function ModuleInstance(options) {}
	function Group(options) {}
	function InputNode(options) {}
	function OutputNode(options) {}
	
	module.exports = {
		//TODO...
	};
	
})();