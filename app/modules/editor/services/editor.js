(function() {
  var Anchor, AnchorHandle, ConnectableNode, Connection, ConnectionEndPoint, Connector, ConnectorInput, Module, ModuleInstance, Neuron, NeuronType, Node, Position,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NeuronType = {
    ACTIVATE: 'activate',
    INHIBIT: 'inhibit',
    ASSOCIATE: 'associate',
    DISASSOCIATE: 'disassociate'
  };

  ConnectorInput = (function() {
    function ConnectorInput(activate, inhibit, associate, disassociate) {
      this.activate = activate;
      this.inhibit = inhibit;
      this.associate = associate;
      this.disassociate = disassociate;
    }

    ConnectorInput.ANY = new ConnectorInput(-1, -1, -1, -1);

    return ConnectorInput;

  })();

  Position = (function() {
    function Position(x, y) {
      this.coordinates = [x, y];
    }

    Position.prototype.toArray = function() {
      return this.coordinates;
    };

    Position.prototype.fromArray = function(array) {
      return this.coordinates = [array[0], array[1]];
    };

    Position.prototype.toJson = function() {
      return this.toArray();
    };

    return Position;

  })();

  AnchorHandle = (function() {
    function AnchorHandle(parent, x, y) {
      this.position = new Position(x, y);
      this.parentAnchor = parent;
    }

    AnchorHandle.prototype.getModule = function() {
      return this.parentAnchor.getModule();
    };

    AnchorHandle.prototype.toJson = function() {
      return this.position.toJson();
    };

    return AnchorHandle;

  })();

  Anchor = (function() {
    function Anchor(x, y) {
      this.position = new Position(x, y);
      this.inHandle = new AnchorHandle(this, 0, 0);
      this.outHandle = new AnchorHandle(this, 0, 0);
      this.parentConnection = null;
    }

    Anchor.prototype.remove = function() {
      if (this.parentConnection) {
        return this.parentConnection.anchors = _.without(this.parentConnection.anchors, this);
      }
    };

    Anchor.prototype.getModule = function() {
      return this.parentConnection.getModule();
    };

    Anchor.prototype.toJson = function() {
      return {
        position: this.position.toJson(),
        inHandle: this.inHandle.toJson(),
        outHandle: this.outHandle.toJson()
      };
    };

    return Anchor;

  })();

  ConnectionEndPoint = (function() {
    function ConnectionEndPoint(path, connector1) {
      this.path = path;
      this.connector = connector1;
    }

    ConnectionEndPoint.prototype.toJson = function() {
      return {
        node: this.path,
        connector: this.connector
      };
    };

    return ConnectionEndPoint;

  })();

  Connection = (function() {
    function Connection(source, destination) {
      this.source = source;
      this.destination = destination;
      this.parentModule = null;
      this.anchors = [];
    }

    Connection.prototype.remove = function() {
      if (this.parentModule) {
        return this.parentModule.connections = _.without(this.parentModule.connections, this);
      }
    };

    Connection.prototype.getModule = function() {
      return this.parentModule;
    };

    Connection.prototype.toJson = function() {
      return {
        source: this.source.toJson(),
        anchors: _.map(this.anchors, function(anchor) {
          return anchor.toJson();
        }),
        destination: this.destination.toJson()
      };
    };

    return Connection;

  })();

  Connector = (function() {
    function Connector(name1, input1, output1) {
      this.name = name1;
      this.input = input1;
      this.output = output1;
      this.parentNode = null;
    }

    return Connector;

  })();

  Module = (function() {
    function Module(name1) {
      this.name = name1;
      this.nodes = [];
      this.connections = [];
    }

    Module.prototype.toJson = function() {
      var i, len, node, nodes, ref;
      nodes = {};
      ref = this.nodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        nodes[node.name] = node.toJson();
      }
      return {
        name: this.name,
        nodes: nodes,
        connections: _.map(this.connections, function(connection) {
          return connection.toJson();
        })
      };
    };

    return Module;

  })();

  Node = (function() {
    Node.prototype.className = '(abstract Node)';

    function Node(name1) {
      this.name = name1;
      this.parentModule = null;
      this.position = new Position(0, 0);
    }

    Node.prototype.remove = function() {
      if (this.parentModule) {
        return this.parentModule.nodes = _.without(this.parentModule.nodes, this);
      }
    };

    Node.prototype.getModule = function() {
      return this.parentModule;
    };

    Node.prototype.toJson = function() {
      return {
        position: this.position.toJson()
      };
    };

    return Node;

  })();

  ModuleInstance = (function(superClass) {
    extend(ModuleInstance, superClass);

    ModuleInstance.prototype.className = 'ModuleInstance';

    function ModuleInstance(name, module) {
      this.module = module;
      ModuleInstance.__super__.constructor.call(this, name);
    }

    ModuleInstance.prototype.toJson = function() {
      var result;
      result = ModuleInstance.__super__.toJson.call(this);
      result.type = 'module-instance';
      result.moduleName = this.module.name;
      return result;
    };

    return ModuleInstance;

  })(Node);

  ConnectableNode = (function(superClass) {
    extend(ConnectableNode, superClass);

    ConnectableNode.prototype.className = '(abstract ConnectableNode)';

    function ConnectableNode(name1) {
      this.name = name1;
      this.parentModule = null;
      this.position = new Position(0, 0);
      this.connectors = [];
    }

    ConnectableNode.prototype.getConnector = function(name) {
      return _.find(this.connectors, function(connector) {
        return connector.name === name;
      }) || null;
    };

    ConnectableNode.prototype.addConnector = function(name, input, output) {
      var connector;
      connector = new Connector(name, input, output);
      connector.parentNode = this;
      return this.connectors.push(connector);
    };

    ConnectableNode.prototype.toJson = function() {
      var result;
      result = ConnectableNode.__super__.toJson.call(this);
      result.position = this.position.toJson();
      return result;
    };

    return ConnectableNode;

  })(Node);

  Neuron = (function(superClass) {
    extend(Neuron, superClass);

    Neuron.prototype.className = 'Neuron';

    function Neuron(name, type) {
      this.type = type;
      Neuron.__super__.constructor.call(this, name);
      this.addConnector('default', ConnectorInput.ANY, this.type);
    }

    Neuron.prototype.toJson = function() {
      var result;
      result = Neuron.__super__.toJson.call(this);
      result.type = 'neuron-' + this.type;
      return result;
    };

    return Neuron;

  })(ConnectableNode);

  angular.module('blueprint').factory('Position', function() {
    return Position;
  }).factory('AnchorHandle', function() {
    return AnchorHandle;
  }).factory('Anchor', function() {
    return Anchor;
  }).factory('ConnectionEndPoint', function() {
    return ConnectionEndPoint;
  }).factory('Connection', function() {
    return Connection;
  }).factory('Connector', function() {
    return Connector;
  }).factory('Module', function() {
    return Module;
  }).factory('Node', function() {
    return Node;
  }).factory('ConnectableNode', function() {
    return ConnectableNode;
  }).factory('Neuron', function() {
    return Neuron;
  }).factory('ModuleInstance', function() {
    return ModuleInstance;
  }).factory('NeuronType', function() {
    return NeuronType;
  }).factory('ConnectorInput', function() {
    return ConnectorInput;
  });

}).call(this);
