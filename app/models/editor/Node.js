angular
  .module('blueprint')
  .factory('Node', function(NgBackboneModel, Position, Connector, ConnectorCollection) {
    return NgBackboneModel.extend({
      idAttribute: 'name',
      defaults: {
        parentModule: null,
        position: null,
        connectors: null,
        className: 'Node'
      },
      initialize: function() {
        this.set({ connectors: new ConnectorCollection() });  
      },
      getConnector: function(name) {
        return this.get('connectors').get(name);  
      },
      addConnector: function(name) {
        var self = this;
        self.get('connectors').push({
          name: name,
          parentNode: self
        });
      },
      getConvexHull: function() {
        //return a list of [x, y] positions
        return []; //override me!!!
      },
      remove: function() {
        var parent = this.get('parentModule');
        parent.get('nodes').remove(this);
      }
    });
  })
  .factory('NodeCollection', function(NgBackboneCollection, Node) {
    return NgBackboneCollection.extend({
      model: Node  
    });  
  });