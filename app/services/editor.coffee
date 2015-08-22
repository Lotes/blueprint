class Position
  constructor: (x, y) ->
    @coordinates = [x, y]
  toArray: () -> 
    @coordinates
  fromArray: (array) -> 
    @coordinates = [array[0], array[1]]
    
class AnchorHandle
  constructor: (parent, x, y) ->
    @position = new Position(x, y)
    @parentAnchor = parent
  getModule: () ->
    @parentAnchor.getModule()    
    
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

class ConnectionEndPoint
  constructor: (@path, @connector) -> 
    #path: [String], connector: String

class Connection
  constructor: (@source, @destination) ->
    @parentModule = null;
    @anchors = [];
  remove: () ->
    if(@parentModule)
      @parentModule.connections = _.without(@parentModule.connections, @)
  getModule: () ->
    @parentModule
    
class Connector
  constructor: (@name) ->
    @parentNode = null;
    
class Module
  constructor: (@name) ->
    @nodes = []
    @connections = []
    
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

class ModuleInstance extends Node
  className: 'ModuleInstance'
  constructor: (name, @module) ->
    super(name)     
     
class ConnectableNode extends Node  
  className: '(abstract ConnectableNode)'
  constructor: (@name) ->
    @parentModule = null;
    @position = new Position(0, 0)
    @connectors = []
  getConnector: (name) ->
    _.find(@connectors, (connector) -> connector.name == name) || null
  addConnector: (name) ->
    connector = new Connector(name)
    connector.parentNode = @
    @connectors.push(connector)
    
class Neuron extends ConnectableNode
  className: 'Neuron'
  constructor: (name, @type) ->
    super(name)
    @addConnector('default')
     
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
  ;