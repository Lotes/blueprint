declare function require(name:string): any;
declare var module: any;

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

        static initializeActualParameters(actuals: ActualParameters, formals: FormalParameters): ActualParameters {
            var result: ActualParameters = {};
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
    }

    /**
     * The super class of all nodes in Blueprint.
     * They can be divided into grouping nodes and connectable nodes.
     * @class Node
     * @constructor
     * @extends Object
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
    class ModuleInstance extends Node {
        _definition: ActualParameters;
        private _nodes: Node[] = [];
        private _connections: Connection[] = [];
        constructor() { super(); }
        get nodes(): Node[] { return this._nodes; }
        get connections(): Connection[] { return this._connections; }
        get definition(): ActualParameters { return this._definition; }
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
        compute(input: ActualParameters): SenderOutput {
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
        compute(input: ActualParameters, state: ActualParameters): ProcessorOutput {
            throw new Error('Implement me in subclass!');
        }
    }

    class Type {
        name: string;
        validate: (value: any) => boolean;
        constructor(name: string, validate: (value: any) => boolean) {
            this.name = name;
            this.validate = validate;
        }
    }

    interface TypeDictionary {
        [name: string]: Type;
    }
    var types: TypeDictionary = {};
    function defineType(name: string, validate: (value: any) => boolean) {
        if (name in types)
            throw new Error('Type "'+name+'" was already defined!');
        types[name] = new Type(name, validate);
    }

    //boolean
    defineType('Boolean', function (value) {
        return typeof (value) === 'boolean';
    });
    //integers
    defineType('Integer', function (value) {
        return typeof(value) === 'number' && value === Math.floor(value);
    });
    defineType('PositiveInteger', function (value) {
        return types['Integer'].validate(value) && value > 0;
    });
    defineType('NonPositiveInteger', function (value) {
        return types['Integer'].validate(value) && value <= 0;
    });
    defineType('NegativeInteger', function (value) {
        return types['Integer'].validate(value) && value < 0;
    });
    defineType('NonNegativeInteger', function (value) {
        return types['Integer'].validate(value) && value >= 0;
    });
    //reals
    defineType('Real', function (value) {
        return typeof (value) === 'number';
    });
    defineType('PositiveReal', function (value) {
        return types['Real'].validate(value) && value > 0;
    });
    defineType('NonPositiveReal', function (value) {
        return types['Real'].validate(value) && value <= 0;
    });
    defineType('NegativeReal', function (value) {
        return types['Real'].validate(value) && value < 0;
    });
    defineType('NonNegativeReal', function (value) {
        return types['Real'].validate(value) && value >= 0;
    });
    defineType('Percentage', function (value) {
        return types['Real'].validate(value) && value >= 0 && value <= 1;
    });
    //string
    defineType('String', function (value) {
        return typeof (value) === 'string';
    });
    defineType('Identifier', function (value) {
        return typeof (value) === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
    });
    defineType('NeuronType', function (value) {
        return value === NeuronType.ACTIVATE
            || value === NeuronType.INHIBIT
            || value === NeuronType.ASSOCIATE
            || value === NeuronType.DISASSOCIATE;
    });

    interface FormalParameter {
        type: Type;
        defaultValue?: any
    }

    interface ActualParameters {
        [name: string]: any;
    }

    interface FormalParameters {
        [name: string]: FormalParameter;
    }

    interface AnyDictionary {
        [name: string]: any;
    }

    interface FormalOptions {
        definition: FormalParameters;
    }

    interface FormalModuleOptions extends FormalOptions {
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
        input: FormalParameters;
        state: FormalParameters;
        output: FormalParameters;
        compute: (context: ProcessorContext) => number;
    }

    interface ProcessorContext {
        definition: ActualParameters;
        input: ActualParameters;
        state: ActualParameters;
        nextState: ActualParameters;
        output: ActualParameters;
    }

    interface ProcessorOutput {
        output: ActualParameters;
        potential: number;
        state: ActualParameters;
    }

    interface FormalConnectionOptions extends FormalOptions {
        compute: (context: ConnectionContext) => number;
    }

    class ConnectionStub {
        source: NodeStub;
        destination: NodeStub;
    }

    class NodeStub {
        potential: number;
        ingoingConnections: ConnectionStub[];
        outgoingConnections: ConnectionStub[];
    }

    interface ConnectionContext {
        definition: ActualParameters;
        weight: number;
        nextWeight: number;
        source: NodeStub;
        destination: NodeStub;
    }

    interface ConnectionOutput {
        potential: number;
        weight: number;
    }

    interface SenderContext {
        definition: ActualParameters;
        input: ActualParameters;
    }

    interface FormalSenderOptions extends FormalOptions {
        input: FormalParameters;
        compute: (context: SenderContext) => number;
    }

    interface SenderOutput {
        potential: number;
    }

    interface FormalReceiverOptions extends FormalOptions {
        output: FormalParameters;
        compute: (context: ReceiverContext) => void;
    }

    interface ReceiverContext {
        definition: ActualParameters;
        output: ActualParameters;
    }

    interface ReceiverOutput {
        output: ActualParameters;
    }

    class Simulation {
        reset() {}
        step() {}
    }

    class Renderer {
        //use viz.js with plain output and dot engine to produce graph
    }

    class Visualization {
        get element(): any { return null; }
    }

    /**
     * A standalone blueprint application.
     * @class Application
     * @constructor
     */
    class Application {
        private _definitions: AnyDictionary = {};
        constructor() {
            this.processor('Neuron', {
                definition: {
                    type: {
                        type: types['NeuronType'],
                        defaultValue: NeuronType.ACTIVATE
                    },
                    maximum: {
                        type: types['NonNegativeReal']
                    },
                    threshold: {
                        type: types['NonNegativeReal']
                    },
                    factor: {
                        type: types['NonNegativeReal']
                    },
                },
                input: { /* none */ },
                state: { /* none */ },
                output: {
                    activation: {
                        type: types['Percentage']
                    },
                },
                compute: function(context: ProcessorContext): number {
                    var signal = 0;
                    this.connections.forEach(function(connection: any) { //TODO set node/connection stub
                        switch(connection.type) {
                            case NeuronType.ACTIVATE:
                                signal += connection.output;
                                break;
                            case NeuronType.INHIBIT:
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
                private _definition: ActualParameters;
                constructor(definition: ActualParameters) {
                    super();
                    this._definition = Object.initializeActualParameters(definition, options.definition);
                }
                compute(input: ActualParameters, state: ActualParameters): ProcessorOutput {
                    var output: ActualParameters = {};
                    var nextState: ActualParameters = {};
                    var context: ProcessorContext = {
                        definition: _.clone(this._definition),
                        input: Object.initializeActualParameters(input, options.input),
                        state: Object.initializeActualParameters(state, options.state),
                        nextState: nextState,
                        output: output
                    };
                    var potential = options.compute(context);
                    if(!types['NonNegativeReal'].validate(potential))
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
                type: types['NonNegativeReal']
            };
            class NewConnection extends Connection {
                private _definition: ActualParameters;
                constructor(definition: ActualParameters) {
                    this._definition = Object.initializeActualParameters(definition, options.definition);
                    super(this._definition['weight']);
                }
                clone(): Connection {
                    return new NewConnection(this._definition);
                }
                compute(stub: ConnectionStub, weight: number): ConnectionOutput {
                    var context: ConnectionContext = {
                        definition: _.clone(this._definition),
                        weight: weight,
                        nextWeight: -1, //must be set, or else an error will be thrown during validation
                        source: stub.source,
                        destination: stub.destination
                    };
                    var potential = options.compute(context);
                    if(!types['NonNegativeReal'].validate(potential))
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
                private _definition: ActualParameters;
                constructor(definition: ActualParameters) {
                    super();
                    this._definition = Object.initializeActualParameters(definition, options.definition);
                }
                compute(input: ActualParameters): SenderOutput {
                    var context: SenderContext = {
                        definition: _.clone(this._definition),
                        input: Object.initializeActualParameters(input, options.input)
                    };
                    var potential = options.compute(context);
                    if(!types['NonNegativeReal'].validate(potential))
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
                private _definition: ActualParameters;
                constructor(definition: ActualParameters) {
                    super();
                    this._definition = Object.initializeActualParameters(definition, options.definition);
                }
                compute(): ReceiverOutput {
                    var output: ActualParameters = {};
                    var context: ReceiverContext = {
                        definition: _.clone(this._definition),
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
        module(name: string, options: FormalModuleOptions): Application {
            this._testName(name);
            function NewModuleInstance(definition: ActualParameters) {
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
        simulation(): Simulation {
            return null;
        }
        visualization(module: any): Visualization {
            return null;
        }
    }

    /**
     * Describes the public level of blueprint.
     * @class BlueprintAPI
     * @constructor
     */
    class BlueprintAPI {
        /**
         * Creates a blueprint application. All definitions will assigned to the application that creates it.
         * @method application
         */
        static application() { return new Application(); }
        static Types: TypeDictionary = types;
        static NeuronType: any = NeuronType;
    }

    //public module interface
    module.exports = BlueprintAPI;
})();