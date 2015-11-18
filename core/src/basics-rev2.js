(function () {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var inherit = require('./inherit');
    
    /**
     * Super class of all classes in Blueprint.
     * @class EventEmitter
     * @constructor
     */
    function EventEmitter() {
        _.extend(this, Backbone.Events);
    }
    
    /**
     * A collection of event names.
     * @class Events
     */
    var Events = {
        /**
         * Will be triggered every simulation cycle for each Object.
         * @event TICK
         * @param object {Object}
         */
        TICK: 'tick',
        /**
         * Will be triggered if the output of a Neuron changes.
         * @event OUTPUT_CHANGE 
         * @param neuron {Neuron}
         * @param output {number}
         */
        OUTPUT_CHANGE: 'output_change',
        /**
         * Will be triggered if the input of a Neuron changes.
         * @event INPUT_CHANGE 
         * @param neuron {Neuron}
         * @param input {number}
         */
        INPUT_CHANGE: 'input_change',
        /**
         * Will be triggered if the input of a Neuron is higher than its threshold.
         * @event ACTIVATE 
         * @param neuron {Neuron}
         */
        ACTIVATE: 'activate',
        /**
         * Will be triggered if the weight of a connection changes.
         * @event WEIGHT_CHANGE
         * @param connection {Connection}
         * @param weight {number}
         */
        WEIGHT_CHANGE: 'weight_change'
    };
    
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

    /**
     * The super class of all nodes in Blueprint.
     * They can be divided into grouping nodes and connectable nodes.
     * @class Node
     * @constructor
     * @extends EventEmitter
     * @todo implement me!
     */
    function Node() {
        Node.__super__.constructor.apply(this, arguments);
        this.parent = null;
    }
    Node.prototype = {
        /**
         * Returns true if one of node's parents is the given instance, false otherwise.
         * @method isChildOf
         * @param moduleInstance {ModuleInstance}
         * @return {boolean}
         */
        isChildOf: function (moduleInstance) {
            var node = this.parent;
            while (node !== null) {
                if (node === moduleInstance)
                    return true;
                node = node.parent;
            }
            return false;
        }
    };
    inherit(Node, EventEmitter);
    
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
        if (!_.isArray(options.nodes) || options.nodes.length === 0)
            throw new Error('"nodes" option requires to be a non-empty array!');
        if (_.filter(options.nodes, function (node) { return !(node instanceof Node); }).length > 0)
            throw new Error('"nodes" option requires to be a set of Nodes');
        Group.__super__.constructor.apply(this, arguments);
        this.nodes = options.nodes.slice();
    }
    Group.prototype = {};
    inherit(Group, Node);
    
    /**
     * Represents an interface for building module instances.
     * @class ModuleBuilder
     * @constructor
     * @todo implement me!
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
        add: function (node) {
            var self = this;
            if (this.finished === true)
                throw new Error('Module instance was already completely built. You can not change it anymore!');
            if (!(node instanceof Node))
                throw new Error('Module instance does only accept Nodes.');
            if (node instanceof Group)
                node.nodes.forEach(function (child) {
                    if(child.parent !== self.result)
                        self.add(child);
                });
            if (node.parent !== null)
                throw new Error('Node is already assigned to a module instance!');
            if (_.indexOf(this.result.nodes, node) > -1)
                throw new Error('Module instance is already parent of that node!');
            this.result.nodes.push(node);
            node.parent = self.result;
            return node;
        },
        /**
         * Groups a set of nodes.
         * @method group
         * @param nodeList {Array<Node>} a list of nodes
         * @return {Group} a Group node
         * @throws {Error} see Group(), see ModuleBuilder.add()
         */
        group: function (nodeList) {
            return this.add(new Group({
                nodes: nodeList
            }));
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
            var index;
            if (this.finished === true)
                throw new Error('Module instance was already completely built. You can not change it anymore!');
            if (source instanceof Group) {
                for (index = 0; index < source.nodes.length; index++)
                    this.connect(source.nodes[index], destination, options);
            } else if (destination instanceof Group) {
                for (index = 0; index < destination.nodes.length; index++)
                    this.connect(source, destination.nodes[index], options);
            } else if (source instanceof ModuleInstance) {
                this.connect(source.sender, destination);
            } else if (destination instanceof ModuleInstance) {
                this.connect(source, destination.receiver);
            } else {
                var config = _.extend({}, options, {
                    source: source,
                    destination: destination
                });
                var connection = new Connection(config);
                connection.parent = this.result;
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
         * @throws {Error} if name is not a string or is already a assigned node or object is not a Node or node is not a child of the resulting module instance.
         */
        register: function (name, node) {
            if (this.finished === true)
                throw new Error('Module instance was already completely built. You can not change it anymore!');
            if (typeof (name) !== 'string')
                throw new Error('Name parameter must be a string!');
            if (name in this.result)
                throw new Error('Name "' + name + '" is already assigned!');
            if (!(node instanceof Node))
                throw new Error('You can only register Nodes! Unknown type!');
            if (!node.isChildOf(this.result))
                throw new Error('You can only register child nodes! Nodes of sibling or other module instances are not allowed!');
            this.result[name] = node;
        },
        /**
         * Set a sender node for the module instance.
         * @method setSender
         * @param node {Node}
         */
        setSender: function (node) {
            this.register('sender', node);
        },
        /**
         * Set a receiver node for the module instance.
         * @method setReceiver
         * @param node {Node}
         */
        setReceiver: function (node) {
            this.register('receiver', node);
        },
    };
    
    /**
     * Defines basic interface for an instantiated Module.
     * @class ModuleInstance
     * @constructor
     * @todo implement me!
     * @extends Node
     */
    function ModuleInstance() {
        ModuleInstance.__super__.constructor.apply(this, arguments);
    }
    ModuleInstance.prototype = {};
    inherit(ModuleInstance, Node);
    
    /**
     * Connects two nodes with each other. Use the module builder to create one.
     * @class Connection
     * @constructor
     * @private
     * @extends Object
     * @param options.source {Node} the starting node of this connection
     * @param options.destination {Node} the ending node of this connection
     */
    function Connection(options) {
        Connection.__super__.constructor.apply(this, arguments);
        this.parent = null;

        options = options || {};
        if (!(options.source instanceof ConnectableNode))
            throw new Error('"source" option must be a ConnectableNode!');
        if (!(options.destination instanceof ConnectableNode))
            throw new Error('"destination" option must be a ConnectableNode!');
        if (options.source instanceof Receiver)
            throw new Error('A receiver can not be a source!');
        if (options.destination instanceof Sender)
            throw new Error('A sender can not be a destination!');
        Connection.__super__.constructor.apply(this, arguments);
        this.source = options.source;
        this.destination = options.destination;
        this.source.connectAsSender(this);
        this.destination.connectAsReceiver(this);
    }
    Connection.prototype = {
        /**
         * Returns true if one of connection's parents is the given instance, false otherwise.
         * @method isChildOf
         * @param moduleInstance {ModuleInstance}
         * @return {boolean}
         */
        isChildOf: function (moduleInstance) {
            var node = this.parent;
            while (node !== null) {
                if (node === moduleInstance)
                    return true;
                node = node.parent;
            }
            return false;
        }
    };
    inherit(Connection, EventEmitter);
    
    /**
     * Connectable nodes can be connected using Connections.
     * The connection is directed (there exist source and destination nodes).
     * @class ConnectableNode
     * @constructor
     * @extends Node
     * @todo implement me!
     */
    function ConnectableNode(options) {
        ConnectableNode.__super__.constructor.apply(this, arguments);
        this.incomingConnections = [];
        this.outgoingConnections = [];
    }
    ConnectableNode.prototype = {
        /**
         * Will be called by the connection constructor to add it to in internal collection of the node.
         * @method connectAsSender
         * @param connection {Connection}
         */
        connectAsSender: function (connection) {
            if (!(connection instanceof Connection))
                throw new Error('You can only connect to Connection!');
            this.outgoingConnections.push(connection);
        },
        /**
         * Will be called by the connection constructor to add it to in internal collection of the node.
         * @method connectAsReceiver
         * @param connection {Connection}
         */
        connectAsReceiver: function (connection) {
            if (!(connection instanceof Connection))
                throw new Error('You can only connect to Connection!');
            this.incomingConnections.push(connection);
        },
    };
    inherit(ConnectableNode, Node);
    
    /**
     * Senders are nodes that only have outgoing connections.
     * @class Sender
     * @constructor
     * @extends ConnectableNode
     * @todo implement me!
     */
    function Sender(options) {
        Sender.__super__.constructor.apply(this, arguments);
    }
    Sender.prototype = {
        /**
         * Do not call this method as sender!
         * @method connectAsReceiver
         * @param connection {Connection}
         */
        connectAsReceiver: function (connection) {
            throw new Error('Invalid operation for a sender!');
        }
    };
    inherit(Sender, ConnectableNode);
    
    /**
     * Receivers are nodes that only have incoming connections.
     * @class Receiver
     * @constructor
     * @extends ConnectableNode
     * @todo implement me!
     */
    function Receiver(options) {
        Receiver.__super__.constructor.apply(this, arguments);
    }
    Receiver.prototype = {
        /**
         * Do not call this method as receiver!
         * @method connectAsSender
         * @param connection {Connection}
         */
        connectAsSender: function (connection) {
            throw new Error('Invalid operation for a receiver!');
        }
    };
    inherit(Receiver, ConnectableNode);
    
    /**
     * Processors are nodes that have both: incoming and outgoing connections.
     * @class Sender
     * @constructor
     * @extends ConnectableNode
     */
    function Processor(options) {
        Processor.__super__.constructor.apply(this, arguments);
    }
    Processor.prototype = {};
    inherit(Processor, ConnectableNode);

    //public module interface
    module.exports = {
        NeuronType: NeuronType,
        Events: Events,
        Sender: Sender,
        Receiver: Receiver,
        Processor: Processor,
        Connection: Connection,
        ModuleInstance: ModuleInstance
    };
})();