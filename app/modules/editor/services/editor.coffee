NeuronType = { 
  ACTIVATE: 'activate', 
  INHIBIT: 'inhibit', 
  ASSOCIATE: 'associate', 
  DISASSOCIATE: 'disassociate' 
}

class ConnectorInput
  constructor: (@activate, @inhibit, @associate, @disassociate) ->
  @ANY: new ConnectorInput(-1, -1, -1, -1) 
  @NONE: new ConnectorInput(0, 0, 0, 0) 

class Position
  constructor: (x, y) ->
    @coordinates = [x, y]
  toArray: () -> 
    @coordinates
  fromArray: (array) -> 
    @coordinates = [array[0], array[1]]
  toJson: () ->
    @toArray()

class AnchorHandle
  constructor: (parent, x, y) ->
    @position = new Position(x, y)
    @parentAnchor = parent
  getModule: () ->
    @parentAnchor.getModule()    
  toJson: () ->
    @position.toJson()

class Anchor
  constructor: (x, y) ->
    @position = new Position(x, y)
    @inHandle = new AnchorHandle(@, 0, 0)
    @outHandle = new AnchorHandle(@, 0, 0)
    @parentConnection = null;
  remove: () ->
    if(@parentConnection)
      @parentConnection.anchors = _.without(@parentConnection.anchors, @)
  getModule: () ->
    @parentConnection.getModule()
  toJson: () ->
    {
      position: @position.toJson(),
      inHandle: @inHandle.toJson(),
      outHandle: @outHandle.toJson()
    }

class ConnectionEndPoint
  constructor: (@path, @connector) -> 
    #path: [String], connector: String
  toJson: () ->
    {
      node: @path,
      connector: @connector
    }

class Connection
  constructor: (@source, @destination) ->
    @parentModule = null;
    @anchors = [];
  remove: () ->
    if(@parentModule)
      @parentModule.connections = _.without(@parentModule.connections, @)
  getModule: () ->
    @parentModule
  toJson: () ->
    {
      source: @source.toJson(),
      anchors: _.map(@anchors, (anchor) -> anchor.toJson()),
      destination: @destination.toJson()
    }
    
class Connector
  constructor: (@name, @input, @output) ->
    @parentNode = null
    #input: ConnectorInput, output: NeuronType
    
class Module
  constructor: (@name) ->
    @nodes = []
    @connections = []
  toJson: ->
    nodes = {}
    for node in @nodes
      nodes[node.name] = node.toJson()
    {
      name: @name, 
      nodes: nodes,
      connections: _.map(@connections, (connection) -> connection.toJson())
    }
  
class Node
  className: 'Node'
  constructor: (@name) ->
    @parentModule = null;
    @position = new Position(0, 0)
  remove: () ->
    if(@parentModule)
      @parentModule.nodes = _.without(@parentModule.nodes, @)
  getModule: () ->
    @parentModule
  toJson: () -> 
    { 
      #name: @name, #no name, it is used as key!
      type: @className,
      position: @position.toJson()
    }

class ModuleInstance extends Node
  className: 'ModuleInstance'
  constructor: (name, @module) ->
    super(name)     
  toJson: () ->
    result = super()
    result.moduleName = @module.name
    result

class ConnectableNode extends Node  
  className: 'ConnectableNode'
  constructor: (name) ->
    super(name)
    @connectors = []
  getConnector: (name) ->
    _.find(@connectors, (connector) -> connector.name == name) || null
  addConnector: (name, input, output) ->
    connector = new Connector(name, input, output)
    connector.parentNode = @
    @connectors.push(connector)
    
class Neuron extends ConnectableNode
  className: 'Neuron'
  constructor: (name, @type) ->
    super(name)
    @addConnector('default', ConnectorInput.ANY, @type)
   
class Plotter extends ConnectableNode
  className: 'Plotter'
  constructor: (name) ->
    super(name)
    @addConnector('input-red', ConnectorInput.ANY, null)
    @addConnector('input-green', ConnectorInput.ANY, null)
    @addConnector('input-blue', ConnectorInput.ANY, null)

class Button extends ConnectableNode
  className: 'Button'
  constructor: (name) ->
    super(name)
    @addConnector('default', ConnectorInput.NONE, NeuronType.ACTIVATE)

class RandomNeuron extends Neuron
  className: 'RandomNeuron'
  constructor: (name) ->
    super(name, NeuronType.ACTIVATE)

class ActivatorNeuron extends Neuron
  className: 'ActivatorNeuron'  
  constructor: (name) ->
    super(name, NeuronType.ACTIVATE)

class InhibitorNeuron extends Neuron
  className: 'InhibitorNeuron'
  constructor: (name) ->
    super(name, NeuronType.INHIBIT)
    
class AssociatorNeuron extends Neuron
  className: 'AssociatorNeuron'
  constructor: (name) ->
    super(name, NeuronType.ASSOCIATE)
    
class DisassociatorNeuron extends Neuron
  className: 'DisassociatorNeuron'
  constructor: (name) ->
    super(name, NeuronType.DISASSOCIATE)
    
angular.module('blueprint')
  .factory('Position', () -> Position)
  .factory('AnchorHandle', () -> AnchorHandle)
  .factory('Anchor', () -> Anchor)
  .factory('ConnectionEndPoint', () -> ConnectionEndPoint)
  .factory('Connection', () -> Connection)
  .factory('Connector', () -> Connector)
  .factory('Module', () -> Module)
  .factory('Node', () -> Node)
  .factory('ConnectableNode', () -> ConnectableNode)
  .factory('Button', () -> Button)
  .factory('Plotter', () -> Plotter)
  .factory('Neuron', () -> Neuron)
  .factory('RandomNeuron', () -> RandomNeuron)
  .factory('ActivatorNeuron', () -> ActivatorNeuron)
  .factory('InhibitorNeuron', () -> InhibitorNeuron)
  .factory('AssociatorNeuron', () -> AssociatorNeuron)
  .factory('DisassociatorNeuron', () -> DisassociatorNeuron)
  .factory('ModuleInstance', () -> ModuleInstance)
  .factory('NeuronType', () -> NeuronType)
  .factory('ConnectorInput', () -> ConnectorInput)
  ;