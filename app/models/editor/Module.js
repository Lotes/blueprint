angular
  .module('blueprint')
  .factory('Module', function(NgBackboneModel, NodeCollection, ConnectionCollection, Node, 
      Position, Connection, Anchor, AnchorCollection, Neuron, ModuleInstance) {
    return NgBackboneModel.extend({
      urlRoot: '/data',
      defaults: {
        name: null,
        description: null,
        nodes: new NodeCollection(),
        connections: new ConnectionCollection()
      },
      parse: function(res) {
        var self = this;
        var name = res.name;
        var description = res.description || "";
        var nodes = new NodeCollection(_.map(res.nodes, function(value, key) {
          var attributes = {
            id: parseInt(key),
            parentModule: self,
            position: new Position({ 
              x: value.position[0],
              y: value.position[1]
            })
          };
          switch(value.type) {
            case 'neuron-activate':
              attributes.type = 'activate';
              return new Neuron(attributes);  
            case 'neuron-inhibit':
              attributes.type = 'inhibit';
              return new Neuron(attributes);  
            case 'neuron-associate':
              attributes.type = 'associate';
              return new Neuron(attributes);  
            case 'neuron-disassociate':
              attributes.type = 'disassociate';
              return new Neuron(attributes);  
            case 'module-instance':
              attributes.moduleName = value.moduleName;
              return new ModuleInstance(attributes);
            default:
              throw new Error('Unknown node type: '+value.type);
          }
        }));
        var connections = _.map(res.connections, function(value) {
          var connection = new Connection({
            parentModule: self,
            source: nodes.get(value.source.node).getConnector(value.source.connector),
            destination: nodes.get(value.destination.node).getConnector(value.destination.connector)
          });
          var anchors = _.map(value.anchors, function(anchor) {
            return new Anchor({
              parentConnection: connection,
              position: new Position({ x: anchor.position[0], y: anchor.position[1] }),
              inHandle: new Position({ x: anchor['in'].position[0], y: anchor['in'].position[1] }),
              outHandle: new Position({ x: anchor['out'].position[0], y: anchor['out'].position[1] })
            });
          });
          connection.set({ anchors: new AnchorCollection(anchors) });
          return connection;
        });
        return {
          name: name,
          description: description,
          nodes: nodes,
          connections: new ConnectionCollection(connections)
        };
      }
    });
  })
  .factory('ModuleCollection', function(NgBackboneCollection, Module) {
    return NgBackboneCollection.extend({
      model: Module
    }) 
  });