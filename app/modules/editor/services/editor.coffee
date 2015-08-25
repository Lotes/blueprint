NeuronType = { 
  ACTIVATE: 'activate', 
  INHIBIT: 'inhibit', 
  ASSOCIATE: 'associate', 
  DISASSOCIATE: 'disassociate' 
}

class ConnectorInput
  constructor: (@activate, @inhibit, @associate, @disassociate) ->
  @ANY: new ConnectorInput(-1, -1, -1, -1) 

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
  className: '(abstract Node)'
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
      position: @position.toJson()  
    }

class ModuleInstance extends Node
  className: 'ModuleInstance'
  constructor: (name, @module) ->
    super(name)     
  toJson: () ->
    result = super()
    result.type = 'module-instance'
    result.moduleName = @module.name
    result

class ConnectableNode extends Node  
  className: '(abstract ConnectableNode)'
  constructor: (@name) ->
    @parentModule = null;
    @position = new Position(0, 0)
    @connectors = []
  getConnector: (name) ->
    _.find(@connectors, (connector) -> connector.name == name) || null
  addConnector: (name, input, output) ->
    connector = new Connector(name, input, output)
    connector.parentNode = @
    @connectors.push(connector)
  toJson: () ->
    result = super()
    result.position = @position.toJson()
    result
    
class Neuron extends ConnectableNode
  className: 'Neuron'
  constructor: (name, @type) ->
    super(name)
    @addConnector('default', ConnectorInput.ANY, @type)
  toJson: () ->
    result = super()
    result.type = 'neuron-'+@type
    result
    
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
  .factory('Neuron', () -> Neuron)
  .factory('ModuleInstance', () -> ModuleInstance)
  .factory('NeuronType', () -> NeuronType)
  .factory('ConnectorInput', () -> ConnectorInput)
  ;