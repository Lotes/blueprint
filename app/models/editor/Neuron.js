angular
  .module('blueprint')
  .factory('Neuron', function(Node, ConnectorCollection, Connector) {
    return Node.extend({
      defaults: _.extend(Node.prototype.defaults, {
        type: 'activate' //activate, inhibit, associate, disassociate  
      }),
      initialize: function() {
        this.set({ connectors: new ConnectorCollection() });
        this.addConnector('default');
      }
    });
  });