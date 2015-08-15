angular
  .module('blueprint')
  .factory('Neuron', function(Node, ConnectorCollection, Connector, bpEditorData) {
    return Node.extend({
      defaults: _.extend({}, Node.prototype.defaults, {
        //connectors, name, parentModule, position
        type: 'activate', //activate, inhibit, associate, disassociate  
        className: 'Neuron'
      }),
      initialize: function() {
        Node.prototype.initialize.call(this, arguments);
        this.addConnector('default');
      },
      getConvexHull: function() {
        var result = [];
        var radius = bpEditorData.config.neuron.outerRadius + 10;
        var parts = 24;
        for(var index=0; index<parts; index++)
          result.push([
            radius * Math.cos(index/parts * Math.PI * 2),
            radius * Math.sin(index/parts * Math.PI * 2)
          ]);
        return result;
      }
    });
  });