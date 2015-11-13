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
    Node.prototype = {};
    inherit(Node, EventEmitter);
    
    /**
     * A group of nodes.
     * @class Group
     * @constructor
     * @extends Node
     * @todo implement me!
     */
    function Group(options) {
        Group.__super__.constructor.apply(this, arguments);
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
        
    }
    ModuleBuilder.prototype = {};
    
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
     * @extends EventEmitter
     * @todo implement me!
     */
    function Connection(options) {
        Connection.__super__.constructor.apply(this, arguments);
        this.parent = null;
    }
    Connection.prototype = {};
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
    }
    ConnectableNode.prototype = {};
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
    Sender.prototype = {};
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
    Receiver.prototype = {};
    inherit(Receiver, ConnectableNode);
    
    /**
     * Processors are nodes that have both: incoming and outgoing connections.
     * @class Sender
     * @constructor
     * @extends ConnectableNode
     * @todo implement me!
     */
    function Processor(options) {
        Processor.__super__.constructor.apply(this, arguments);
    }
    Processor.prototype = {};
    inherit(Processor, ConnectableNode);

    //public inteface!
    module.exports = {
        Sender: Sender,
        Receiver: Receiver,
        Processor: Processor,
        Connection: Connection,
        ModuleInstance: ModuleInstance
    };
})();