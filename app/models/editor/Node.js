angular
  .module('blueprint')
  .factory('Node', function(NgBackboneModel, Position, Connector, ConnectorCollection) {
    return NgBackboneModel.extend({
      defaults: {
        name: null,
        parentModule: null,
        position: null,
        connectors: null
      },
      getConnector: function(name) {
        return this.get('connectors').get(name);  
      },
      addConnector: function(name) {
        var self = this;
        self.get('connectors').push({
          id: name,
          node: self
        });
      }
    });
  })
  .factory('NodeCollection', function(NgBackboneCollection, Node) {
    return NgBackboneCollection.extend({
      model: Node  
    });  
  });