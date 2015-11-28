declare function require(name:string): any;
declare var module: any

(function() {
'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

/**
 * Super class of all classes in Blueprint.
 * @class Object
 * @constructor
 */
class Object {
    _parent: ModuleInstance = null;
    constructor() {
        _.extend(this, Backbone.Events);
    }
    /**
     * Get the parent module
     * @property parent
     * @return {ModuleINstance}
     */
    get parent(): ModuleInstance {
        return this._parent;
    }
    /**
     * Returns true if one of node's parents is the given instance, false otherwise.
     * @method isChildOf
     * @param moduleInstance {ModuleInstance}
     * @return {boolean}
     */
    isChildOf(moduleInstance: ModuleInstance): boolean {
        var node = this.parent;
        while (node !== null) {
            if (node === moduleInstance)
                return true;
            node = node.parent;
        }
        return false;
    }
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
enum NeuronType {
    /**
     * Describes a neuron that sends an activating signal over the outgoing connections.
     * @property ACTIVATE
     * @static
     */
    ACTIVATE,
    /**
     * Describes a neuron that sends an inhibiting signal over the outgoing connections.
     * @property INHIBIT
     * @static
     */
    INHIBIT,
    /**
     * Describes a neuron that strengthens other connections when activated.
     * @property ASSOCIATE
     * @static
     */
    ASSOCIATE,
    /**
     * Describes a neuron that weakens other connections when activated.
     * @property DISASSOCIATE
     * @static
     */
    DISASSOCIATE
};

/**
 * The super class of all nodes in Blueprint.
 * They can be divided into grouping nodes and connectable nodes.
 * @class Node
 * @constructor
 * @extends Object
 * @todo implement me!
 */
class Node extends Object {
    constructor() { super(); }
}

/**
 * Defines a group of nodes for a simpler accessing. Use the module builder to create one.
 * @class Group
 * @constructor
 * @extends Node
 * @param options.nodes {Array<Node>} a non-empty array of Nodes that form the group
 * @private
 * @throws {Error} if nodes is not an array or has zero length or contains non-Node objects
 */
class Group extends Node {
    private _nodes: Node[];
    constructor(nodes: Node[]) {
        super();
        if(nodes.length == 0)
            throw new Error('Group must not be empty!');
        this._nodes = nodes.slice();
    }
    /**
     * Get all nodes of the group.
     * @property nodes
     * @return {Node[]}
     */
    get nodes(): Node[] {
        return this._nodes;
    }
}

/**
 * Represents an interface for building module instances.
 * @class ModuleBuilder
 * @constructor
 * @todo implement me!
 */
class ModuleBuilder {
    private _result: ModuleInstance = new ModuleInstance();
    private _finished: boolean = false;
    constructor() {}
    /**
     * Adds a node to the module instance.
     * @method add
     * @param nodeInstance {Node} any concrete node instance
     * @throws {Error} if module was already constructed or object is not a Node or node is already part of that instance
     */
    add(node: Node): Node {
        var self = this;
        if (this._finished === true)
            throw new Error('Module instance was already completely built. You can not change it anymore!');
        if (node instanceof Group)
            node.nodes.forEach(function (child) {
                if(child.parent !== self._result)
                    self.add(child);
            });
        if (node.parent !== null)
            throw new Error('Node is already assigned to a module instance!');
        if (this.result.nodes.indexOf(node) > -1)
            throw new Error('Module instance is already parent of that node!');
        this._result.nodes.push(node);
        node._parent = self._result;
        return node;
    }
    /**
     * Groups a set of nodes.
     * @method group
     * @param nodeList {Array<Node>} a list of nodes
     * @return {Node} a node (the group)
     * @throws {Error} see Group(), see ModuleBuilder.add()
     */
    group(nodeList: Node[]): Node {
        return this.add(new Group(nodeList));
    }
    /**
     * Connect two nodes with each other. Returns more than one connection if source or destination contains groups.
     * Throws an error if at least one connection is not allowed!
     * @method connect
     * @param source {Node} the source node
     * @param destination {Node} the destination node
     * @throws {Error} see Connection constructor
     * @todo implement me
     */
    connect(source: Node, destination: Node, definition: Connection): void {
        var index: number;
        var dictionary: any;
        if (this._finished === true)
            throw new Error('Module instance was already completely built. You can not change it anymore!');
        if (source instanceof Group) {
        for (index = 0; index < source.nodes.length; index++)
            this.connect(source.nodes[index], destination, definition);
        } else if (destination instanceof Group) {
            for (index = 0; index < destination.nodes.length; index++)
                this.connect(source, destination.nodes[index], definition);
        } else if (source instanceof ModuleInstance) {
            dictionary = source;
            this.connect(dictionary['sender'], destination, definition);
        } else if (destination instanceof ModuleInstance) {
            dictionary = destination;
            this.connect(source, dictionary['receiver'], definition);
        } else {
            //TODO set source and destination, wire up all connections!
            /*var config = _.extend({}, options, {
            source: source,
            destination: destination
            });
            var connection = new Connection(config);
            connection.parent = this.result;
            this.result.connections.push(connection);*/
        }
    }
    /**
     * Finishs building the constructed module instance. Surpresses future builder calls!
     * @method end
     */
    end() { this._finished = true; }
    /**
     * Returns the constructed module instance.
     * @method getResult
     */
    get result() { return this._result; }
    /**
     * Registers a node under a name for easier access.
     * @method register
     * @param name {String} name of the node
     * @param node {Node} the node which should be assigned to a name
     * @throws {Error} if name is not a string or is already a assigned node or object is not a Node or node is not a child of the resulting module instance.
     */
    register(name: string, node: Node): void {
        if (this._finished === true)
            throw new Error('Module instance was already completely built. You can not change it anymore!');
        if (name in this._result)
            throw new Error('Name "' + name + '" is already assigned!');
        if (!node.isChildOf(this._result))
            throw new Error('You can only register child nodes! Nodes of sibling or other module instances are not allowed!');
        var dictionary: any = this._result;
        dictionary[name] = node;
    }
    /**
     * Set a sender node for the module instance.
     * @method setSender
     * @param node {Node}
     */
    setSender(node: Node) {
        this.register('sender', node);
    }
    /**
     * Set a receiver node for the module instance.
     * @method setReceiver
     * @param node {Node}
     */
    setReceiver(node: Node) {
        this.register('receiver', node);
    }
}

/**
 * Defines basic interface for an instantiated Module.
 * @class ModuleInstance
 * @constructor
 * @todo implement me!
 * @extends Node
 */
class ModuleInstance extends Node {
    private _nodes: Node[] = [];
    private _connections: Connection[] = [];
    constructor() { super(); }
    get nodes(): Node[] { return this._nodes; }
    get connections(): Connection[] { return this._connections; }
}

/**
 * Connects two nodes with each other. Use the module builder to create one.
 * @class Connection
 * @constructor
 * @private
 * @extends Object
 */
class Connection extends Object {
    private _source: ConnectableNode = null;
    private _destination: ConnectableNode = null;
    constructor() {
        super();
    }
    get connected(): boolean { return this._source !== null && this._destination !== null; }
    connectNew(source: ConnectableNode, destination: ConnectableNode): Connection {
        var result = new Connection(); //TODO clone
        result._source = source;
        result._destination = destination;
        this._source.connectAsSender(this);
        this._destination.connectAsReceiver(this);
        return result;
    }
    get source(): ConnectableNode { return this._source; }
    get destination(): ConnectableNode { return this._destination; }
}

/**
 * Connectable nodes can be connected using Connections.
 * The connection is directed (there exist source and destination nodes).
 * @class ConnectableNode
 * @constructor
 * @extends Node
 * @todo implement me!
 */
class ConnectableNode extends Node {
    private _ingoingConnections: Connection[] = [];
    private _outgoingConnections: Connection[] = [];
    constructor() {
        super();
    }
    /**
     * Will be called by the connection constructor to add it to in internal collection of the node.
     * @method connectAsSender
     * @param connection {Connection}
     */
    connectAsSender(connection: Connection) {
        this._outgoingConnections.push(connection);
    }
    /**
     * Will be called by the connection constructor to add it to in internal collection of the node.
     * @method connectAsReceiver
     * @param connection {Connection}
     */
    connectAsReceiver(connection: Connection) {
        this._ingoingConnections.push(connection);
    }
    get ingoingConnections(): Connection[] { return this._ingoingConnections; }
    get outgoingConnections(): Connection[] { return this._outgoingConnections; }
}

/**
 * Senders are nodes that only have outgoing connections.
 * @class Sender
 * @constructor
 * @extends ConnectableNode
 * @todo implement me!
 */
class Sender extends ConnectableNode {
    constructor() {
        super();
    }
    /**
     * Do not call this method as sender!
     * @method connectAsReceiver
     * @param connection {Connection}
     */
    connectAsReceiver(connection: Connection) {
        throw new Error('Invalid operation for a sender!');
    }
}

/**
 * Receivers are nodes that only have incoming connections.
 * @class Receiver
 * @constructor
 * @extends ConnectableNode
 * @todo implement me!
 */
class Receiver extends ConnectableNode {
    constructor() {
        super();
    }
    /**
     * Do not call this method as receiver!
     * @method connectAsSender
     * @param connection {Connection}
     */
    connectAsSender(connection: Connection) {
        throw new Error('Invalid operation for a receiver!');
    }
}

/**
 * Processors are nodes that have both: incoming and outgoing connections.
 * @class Sender
 * @constructor
 * @extends ConnectableNode
 */
class Processor extends ConnectableNode {
    constructor() {
        super();
    }
}

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