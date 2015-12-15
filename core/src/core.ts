'use strict';

import common = require('./common');
import serializer = require('./serializer');
import deferred = require('./deferred');

/**
 * Produces a deep copy of an object.
 */
function clone(value: any) {
		return JSON.parse(JSON.stringify(value));
}

/**
 * Super class of all classes in Blueprint.
 * @class Object
 * @constructor
 */
export class Object {
    _parent: ModuleInstance = null;
    constructor() {}
    /**
     * Get the parent module
     * @property parent
     * @return {ModuleInstance}
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
    static initializeActualParameters(actuals: common.ActualParameters, formals: common.FormalParameters): common.ActualParameters {
        var result: common.ActualParameters = {};
        //check defined values
        for (var name in actuals) {
            if (actuals.hasOwnProperty(name)) {
                if (!formals.hasOwnProperty(name))
                    throw new Error('Unknown parameter "' + name + '"!');
                var parameter = formals[name];
                var value = actuals[name];
                if (!parameter.type.validate(value))
                    throw new Error('"'+value+'" is no valid value for parameter "'+name+'"!');
                result[name] = value;
            }
        }
        //fill undefined values, alert missing values
        for (var name in formals) {
            if (formals.hasOwnProperty(name)) {
                if (actuals.hasOwnProperty(name))
                    continue;
                var parameter = formals[name];
                if(typeof(parameter.defaultValue) === 'undefined')
                    throw new Error('Parameter "' + name + '" is required, it has no default value!');
                if(!parameter.type.validate(parameter.defaultValue))
                    throw new Error('Parameter "'+name+'" has an invalid default value!');
                result[name] = parameter.defaultValue;
            }
        }
        return result;
    }
}

/**
 * The super class of all nodes in Blueprint.
 * They can be divided into grouping nodes and connectable nodes.
 * @class Node
 * @constructor
 * @extends Object
 */
export class Node extends Object {
    constructor() { super(); }
}

/**
 * Defines a group of nodes for a simpler accessing. Use the module builder to create one.
 * @class Group
 * @constructor
 * @extends Node
 * @param options.nodes {Array<Node>} a non-empty array of Nodes that form the group
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
 */
class ModuleBuilder {
    private _result: ModuleInstance = new ModuleInstance();
    private _finished: boolean = false;
    constructor() {}
    /**
     * Adds a node to the module instance.
     * @method add
     * @param node {Node} any concrete node
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
     * @param definition {Connection} the connection definition
     * @throws {Error} see Connection constructor
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
            var connection = definition.connectNew(<ConnectableNode>source, <ConnectableNode>destination);
            connection._parent = this._result;
            this._result.connections.push(connection);
        }
    }
    /**
     * Finishes building the constructed module instance. Supresses future builder calls!
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
 * @extends Node
 */
export class ModuleInstance extends Node {
    _definition: common.ActualParameters;
    private _nodes: Node[] = [];
    private _connections: Connection[] = [];
    constructor() { super(); }
    get nodes(): Node[] { return this._nodes; }
    get connections(): Connection[] { return this._connections; }
    get definition(): common.ActualParameters { return this._definition; }
}

/**
 * Connects two nodes with each other. Use the module builder to create one.
 * @class Connection
 * @constructor
 * @private
 * @extends Object
 */
export class Connection extends Object {
    private _source: ConnectableNode = null;
    private _destination: ConnectableNode = null;
    private _weight: number;
    constructor(weight: number) {
        super();
        this._weight = weight;
    }
    get connected(): boolean { return this._source !== null && this._destination !== null; }
    connectNew(source: ConnectableNode, destination: ConnectableNode): Connection {
        var result = this.clone();
        result._source = source;
        result._destination = destination;
        this._source.connectAsSender(this);
        this._destination.connectAsReceiver(this);
        return result;
    }
    get initialWeight(): number { return this._weight; }
    get source(): ConnectableNode { return this._source; }
    get destination(): ConnectableNode { return this._destination; }
    clone(): Connection {
        throw new Error('Implement me in subclass!');
    }
    compute(stub: ConnectionStub, weight: number): ConnectionOutput {
        throw new Error('Implement me in subclass!');
    }
}

/**
 * Connectable nodes can be connected using Connections.
 * The connection is directed (there exist source and destination nodes).
 * @class ConnectableNode
 * @constructor
 * @extends Node
 */
export class ConnectableNode extends Node {
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
    compute(input: common.ActualParameters): SenderOutput {
        throw new Error('Implement me in subclass!');
    }
}

/**
 * Receivers are nodes that only have incoming connections.
 * @class Receiver
 * @constructor
 * @extends ConnectableNode
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
    compute(): ReceiverOutput {
        throw new Error('Implement me in subclass!');
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
    compute(input: common.ActualParameters, state: common.ActualParameters): ProcessorOutput {
        throw new Error('Implement me in subclass!');
    }
}

interface AnyDictionary {
    [name: string]: any;
}

export interface FormalOptions {
    definition: common.FormalParameters;
}

export interface FormalModuleOptions extends FormalOptions {
    build: () => void;
}

enum ObjectType {
    CONNECTION,
    PROCESSOR,
    SENDER,
    RECEIVER,
    MODULE
}

interface FormalProcessorOptions extends FormalOptions {
    input: common.FormalParameters;
    state: common.FormalParameters;
    output: common.FormalParameters;
    compute: (context: ProcessorContext) => number;
}

interface ProcessorContext {
    definition: common.ActualParameters;
    input: common.ActualParameters;
    state: common.ActualParameters;
    nextState: common.ActualParameters;
    output: common.ActualParameters;
}

interface ProcessorOutput {
    output: common.ActualParameters;
    potential: number;
    state: common.ActualParameters;
}

interface FormalConnectionOptions extends FormalOptions {
    compute: (context: ConnectionContext) => number;
}

export class ConnectionStub {
    source: NodeStub;
    destination: NodeStub;
}

export class NodeStub {
    potential: number;
    ingoingConnections: ConnectionStub[];
    outgoingConnections: ConnectionStub[];
}

interface ConnectionContext {
    definition: common.ActualParameters;
    weight: number;
    nextWeight: number;
    source: NodeStub;
    destination: NodeStub;
}

export interface ConnectionOutput {
    potential: number;
    weight: number;
}

interface SenderContext {
    definition: common.ActualParameters;
    input: common.ActualParameters;
}

interface FormalSenderOptions extends FormalOptions {
    input: common.FormalParameters;
    compute: (context: SenderContext) => number;
}

interface SenderOutput {
    potential: number;
}

interface FormalReceiverOptions extends FormalOptions {
    output: common.FormalParameters;
    compute: (context: ReceiverContext) => void;
}

interface ReceiverContext {
    definition: common.ActualParameters;
    output: common.ActualParameters;
}

interface ReceiverOutput {
    output: common.ActualParameters;
}

export enum SimulationLocation {
    LOCAL,
    REMOTE,
    WORKER
}

export interface ModuleInstanceState {
    getNode(path: number[]): common.ActualParameters;
    getConnection(path: number[]): common.ActualParameters;
    setNode(path: number[], state: common.ActualParameters): void;
    setConnection(path: number[], state: common.ActualParameters): void;
}

export interface Simulation {
    reset(): deferred.Abortable<boolean>;
    step(): deferred.Abortable<boolean>;
    setInput(): deferred.Abortable<boolean>;
    setState(): deferred.Abortable<boolean>;
    getState(): deferred.Abortable<boolean>;
    getOutput(): deferred.Abortable<boolean>;
}

//export class LocalSimulation implements Simulation {}

//export class RemoteSimulation implements Simulation {}

//export class SimulationWorker implements Simulation {}

/**
 * TODO own JS module
 */
export class Visualization {
    constructor(instance: ModuleInstance) {
        
    }
    get element(): any { return null; }
}

/**
 * A standalone blueprint application.
 * @class Application
 * @constructor
 */
export class Application {
    private _definitions: AnyDictionary = {};
    constructor() {
        this.processor('Neuron', {
            definition: {
                type: {
                    type: common.types['NeuronType'],
                    defaultValue: common.NeuronType.ACTIVATE
                },
                maximum: {
                    type: common.types['NonNegativeReal']
                },
                threshold: {
                    type: common.types['NonNegativeReal']
                },
                factor: {
                    type: common.types['NonNegativeReal']
                },
            },
            input: { /* none */ },
            state: { /* none */ },
            output: {
                activation: {
                    type: common.types['Percentage']
                },
            },
            compute: function(context: ProcessorContext): number {
                var signal = 0;
                this.connections.forEach(function(connection: any) { //TODO set node/connection stub
                    switch(connection.type) {
                        case common.NeuronType.ACTIVATE:
                            signal += connection.output;
                            break;
                        case common.NeuronType.INHIBIT:
                            signal -= connection.output;
                            break;
                    }
                });
                var threshold = context.definition['threshold'];
                if(signal >= threshold) {
                    context.output['activation'] = 1;
                    var maximum = context.definition['maximum'];
                    var factor = context.definition['factor'];
                    return Math.max(0, Math.min(maximum, (signal-threshold)*factor));
                } else {
                    context.output['activation'] = Math.max(0, signal/threshold);
                    return 0;
                }
            }
        });
    }
    private _testName(name: string): void {
        if(name in this._definitions)
            throw new Error('Name "'+name+'" was already assigned to another definition!');
    }
    private _registerDefinition(name: string, type: ObjectType, definition: any): void {
        this._definitions[name] = {
            type: type,
            definition: definition
        };
    }
    private processor(name: string, options: FormalProcessorOptions): Application {
        this._testName(name);
        class NewProcessor extends Processor {
            private _definition: common.ActualParameters;
            constructor(definition: common.ActualParameters) {
                super();
                this._definition = Object.initializeActualParameters(definition, options.definition);
            }
            compute(input: common.ActualParameters, state: common.ActualParameters): ProcessorOutput {
                var output: common.ActualParameters = {};
                var nextState: common.ActualParameters = {};
                var context: ProcessorContext = {
                    definition: clone(this._definition),
                    input: Object.initializeActualParameters(input, options.input),
                    state: Object.initializeActualParameters(state, options.state),
                    nextState: nextState,
                    output: output
                };
                var potential = options.compute(context);
                if(!common.types['NonNegativeReal'].validate(potential))
                    throw new Error('Return value must be a non-negative real!');
                return {
                    potential: potential,
                    state: Object.initializeActualParameters(nextState, options.state),
                    output: Object.initializeActualParameters(output, options.output)
                };
            }
        }
        this._registerDefinition(name, ObjectType.PROCESSOR, NewProcessor);
        return this;
    }
    private connection(name: string, options: FormalConnectionOptions): Application {
        //TODO die compute-Funktion ist knifflig...
        this._testName(name);
        if('weight' in options.definition)
            throw new Error('Can not overwrite "weight" definition!');
        options.definition['weight'] = {
            type: common.types['NonNegativeReal']
        };
        class NewConnection extends Connection {
            private _definition: common.ActualParameters;
            constructor(definition: common.ActualParameters) {
                this._definition = Object.initializeActualParameters(definition, options.definition);
                super(this._definition['weight']);
            }
            clone(): Connection {
                return new NewConnection(this._definition);
            }
            compute(stub: ConnectionStub, weight: number): ConnectionOutput {
                var context: ConnectionContext = {
                    definition: clone(this._definition),
                    weight: weight,
                    nextWeight: -1, //must be set, or else an error will be thrown during validation
                    source: stub.source,
                    destination: stub.destination
                };
                var potential = options.compute(context);
                if(!common.types['NonNegativeReal'].validate(potential))
                    throw new Error('Return value must be a non-negative real!');
                return {
                    potential: potential,
                    weight: context.nextWeight
                };
            }
        }
        this._registerDefinition(name, ObjectType.CONNECTION, NewConnection);
        return this;
    }
    private sender(name: string, options: FormalSenderOptions): Application {
        this._testName(name);
        class NewSender extends Sender {
            private _definition: common.ActualParameters;
            constructor(definition: common.ActualParameters) {
                super();
                this._definition = Object.initializeActualParameters(definition, options.definition);
            }
            compute(input: common.ActualParameters): SenderOutput {
                var context: SenderContext = {
                    definition: clone(this._definition),
                    input: Object.initializeActualParameters(input, options.input)
                };
                var potential = options.compute(context);
                if(!common.types['NonNegativeReal'].validate(potential))
                    throw new Error('Return value must be a non-negative real!');
                return {
                    potential: potential
                };
            }
        }
        this._registerDefinition(name, ObjectType.SENDER, NewSender);
        return this;
    }
    private receiver(name: string, options: FormalReceiverOptions): Application {
        this._testName(name);
        class NewReceiver extends Receiver {
            private _definition: common.ActualParameters;
            constructor(definition: common.ActualParameters) {
                super();
                this._definition = Object.initializeActualParameters(definition, options.definition);
            }
            compute(): ReceiverOutput {
                var output: common.ActualParameters = {};
                var context: ReceiverContext = {
                    definition: clone(this._definition),
                    output: output
                };
                options.compute(context);
                return {
                    output: Object.initializeActualParameters(output, options.output)
                };
            }
        }
        this._registerDefinition(name, ObjectType.RECEIVER, NewReceiver);
        return this;
    }
    /**
     * Define a module.
     */
    module(name: string, options: FormalModuleOptions): Application {
        this._testName(name);
        function NewModuleInstance(definition: common.ActualParameters) {
            definition = Object.initializeActualParameters(definition, options.definition);
            var builder = new ModuleBuilder();
            options.build.call(builder, definition);
            builder.end();
            builder.result._definition = definition;
            return builder.result;
        }
        this._registerDefinition(name, ObjectType.MODULE, NewModuleInstance);
        return this;
    }
    /**
     * Returns a registered module class or throws an error.
     */
    getModule(name: string): any {
        if(name in this._definitions && this._definitions[name].type === ObjectType.MODULE)
    		      return this._definitions[name].definition;
    		  throw new Error('No module "'+name+'" found!');
    }
    /**
     * Simulate a module instance using local or remote simulator.
     */
    simulate(instance: ModuleInstance, location: SimulationLocation = SimulationLocation.LOCAL): deferred.Abortable<Simulation> {
	    var result = new deferred.Deferred<Simulation>(() => {});
	    
	    return result.abortable;
	}
}