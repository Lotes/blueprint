(function() {
    /*
    TODO:
        - wo ist die interne Struktur für alle anderen Prozesse (Layout, Simulation, Serialisierung)?
            - durch Instanziierung eines Moduls - in der Modulinstanz
    */
    
    var extend = require('./extend');
    var _ = require('underscore');
    var Backbone = require('backbone');

    /**
     * Super class of all classes in Blueprint.
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
     * Represents an interface for building module instances.
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
         * @throws {Error} if module was already constructed or object is not a Node or node is already part of that instance
         */
        add: function(node) {
            if (this.finished === true)
                throw new Error('Module instance was already completely built. You can not change it anymore!');
            if (!(node instanceof Node))
                throw new Error('Module instance does only accept Nodes.');
            if (node instanceof Group)
                throw new Error('Module instance does not accept Groups as direct node members (see register(name, node)).');
            if (_.indexOf(this.result.nodes, node) > -1)
                throw new Error('Module instance does already contain that node!');
            this.result.nodes.push(node);
            return node;
        },
        /**
         * Groups a set of nodes.
         * @method group
         * @param nodeList {Array<Node>} a list of nodes
         * @return {Group} a Group node
         * @throws {Error} see Group
         */
        group: function(nodeList) {
            return new Group({
                nodes: nodeList
            });
        },
        /**
         * Connect two nodes with each other. Returns more than one connection if source or destination contains groups.
         * Throws an error if at least one connection is not allowed!
         * @method connect
         * @param source {Node} the source node
         * @param destination {Node} the destination node
         * @throws {Error} see Connection constructor
         * @todo implement me
         */
        connect: function (source, destination, options) {
            if (this.finished === true)
                throw new Error('Module instance was already completely built. You can not change it anymore!');
            if (source instanceof Group) {
                var nodes = source.nodes;
                for (var index = 0; index < nodes.length; index++)
                    this.connect(nodes[index], destination, options);
            } else if (destination instanceof Group) {
                var nodes = destination.nodes;
                for (var index = 0; index < nodes.length; index++)
                    this.connect(source, nodes[index], options);
            } else {
                var config = _.extend({}, options, {
                    source: source,
                    destination: destination
                });
                var connection = new Connection(config);
                source.outgoingConnections.push(connection);
                destination.incomingConnections.push(connection);
                this.result.connections.push(connection);
            }
        },
        /**
         * Finishs building the constructed module instance. Surpresses future builder calls!
         * @method end
         */
        end: function () { this.finished = true; },
        /**
         * Returns the constructed module instance.
         * @method getResult
         */
        getResult: function () { return this.result; },
        /**
         * Registers a node under a name for easier access.
         * @method register
         * @param name {String} name of the node
         * @param node {Node} the node which should be assigned to a name
         * @throws {Error} if name is not a string or is already a assigned node or object is not a Node
         */
        register: function (name, node) {
            if (typeof (name) !== 'string')
                throw new Error('Name parameter must be a string!');
            if (name in this.result)
                throw new Error('Name "' + name + '" is already assigned!');
            if (!(node instanceof Node))
                throw new Error('Can only register Nodes! Unknown type!');
            this.result[name] = node;
        }
    };
    
    /**
     * Defines how a module instance has to be built.
     * @class Module
     * @constructor
     * @param options.builder {function(options, self)} a function with a passed module 
     *        builder as `this` object to construct the module. The options parameter 
     *        corresponds to the one of the ModuleInstance node constructor. `self` is the 
     *        module instance itself.
     * @todo add other options, like template url or gui controller
     * @example
     *      var IfThenElseModule = new Blueprint.Module({
     *          builder: function(options, self) {
     *              var thenBranch = this.add(new Blueprint.Neuron({
     *                  type: Blueprint.NeuronType.ACTIVATE,
     *                  ...
     *              }));
     *              thenBranch.on('activate', function() {
     *                  self.trigger('then');
     *              });
     *              this.register('thenBranch', thenBranch);
     *          }
     *      });
     */
    function Module(options) {
        if(typeof(options.builder) !== 'function')
            throw new Error('The "builder" option must be a function!');
        var builderDefinition = options.builder;
        function construct(options) {
            options = options || {};
            var builder = new ModuleBuilder();
            var result = builder.getResult();
            builderDefinition.call(builder, options, result);
            builder.end();
            result.options = options;
            return result;
        }
        return construct;
    }
    
    /**
     * The super class of all connectable entities in Blueprint.
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
     * Defines basic interface for an instantiated Module.
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
    
    /**
     * Defines a group of nodes for a simpler accessing. Use the module builder to create one.
     * @class Group
     * @constructor
     * @extends Node
     * @param options.nodes {Array<Node>} a non-empty array of Nodes that form the group
     * @private
     * @throws {Error} if nodes is not an array or has zero length or contains non-Node objects
     */
    function Group(options) {
        if (!_.isArray(options.nodes) || options.nodes.length == 0)
            throw new Error('"nodes" option requires to be a non-empty array!');
        if (_.filter(options.nodes, function (node) { return !(node instanceof Node); }).length > 0)
            throw new Error('"nodes" option requires to be a set of Nodes');
        Group.__super__.constructor.apply(this, arguments);
        this.nodes = options.nodes;
    }
    extend(Group, Node);
    
    /**
     * Connects two nodes with each other. Use the module builder to create one.
     * @class Connection
     * @constructor
     * @private
     * @param options.source {Node} the starting node of this connection
     * @param options.destination {Node} the ending node of this connection
     * @param options.weight {float} a non-negative weight value 
     */
    function Connection(options) {
        options = options || {};
        if (!(options.source instanceof Node))
            throw new Error('"source" option must be a Node!');
        if (!(options.destination instanceof Node))
            throw new Error('"destination" option must be a Node!');
        if (source instanceof Group || destination instanceof Group)
            throw new Error('Can not connect Groups directly!');
        if (source instanceof Receiver)
            throw new Error('A receiver can not be a source!');
        if (destination instanceof Sender)
            throw new Error('A sender can not be a destination!');
        if (typeof (options.weight) !== 'number' || options.weight < 0)
            throw new Error('"weight" option must be a non-negative float!');
        Connection.__super__.constructor.apply(this, arguments);
        this.source = options.source;
        this.destination = options.destination;
        this.weight = options.weight;
    }
    extend(Connection, Object);
    
    function makeSender(node) {
        node.outgoingConnections = [];
    }
    function makeReceiver(node) {
        node.incomingConnections = [];
    }

    /**
     * Senders can be used for creating input nodes like switches or sliders.
     * @class Sender
     * @constructor
     * @private
     * @todo implement me
     */
    function Sender(options) {
        Sender.__super__.constructor.apply(this, arguments);
        makeSender(this);
    }
    extend(Sender, Node);
    
    /**
     * Receiver can be used for creating output nodes like monitors or LEDs.
     * @class Receiver
     * @constructor
     * @private
     * @todo implement me
     */
    function Receiver(options) {
        Receiver.__super__.constructor.apply(this, arguments);
        makeReceiver(this);
    }
    extend(Receiver, Node);

    /**
     * A neuron is the processing unit of the net. It is receiver and sender at once!
     * @class Neuron
     * @constructor
     * @todo implement me
     */
    function Neuron(options) {
        Neuron.__super__.constructor.apply(this, arguments);
        makeSender(this);
        makeReceiver(this);
        type: NeuronType
        maximum: Float
        threshold: Float
        factor: Float
        associateConstant: Float
        disassociateConstant: Float
        input: Float
    }
    extend(Neuron, Node);
    
    /**
     * @class NeuronType  
     */
    var NeuronType = {
        /**
         * Describes a neuron that sends an activating signal over the outgoing connections.
         * @property ACTIVATE
         * @static
         */
        ACTIVATE: 0,
        /**
         * Describes a neuron that sends an inhibiting signal over the outgoing connections.
         * @property INHIBIT
         * @static
         */
        INHIBIT: 1,
        /**
         * Describes a neuron that strengthens other connections when activated.
         * @property ASSOCIATE
         * @static
         */
        ASSOCIATE: 2,
        /**
         * Describes a neuron that weakens other connections when activated.
         * @property DISASSOCIATE
         * @static
         */
        DISASSOCIATE: 3,
    };

    module.exports = {
        Module: Module,
        NeuronType: NeuronType,
        Neuron: Neuron,
        Sender: Sender,
        Receiver: Receiver,
        EVENT_TICK: EVENT_TICK,
    };
})();