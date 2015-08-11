angular
  .module('blueprint')
  .factory('Neuron', function(Node, ConnectorCollection, Connector) {
    return Node.extend({
      defaults: {
        type: 'activate' //activate, inhibit, associate, disassociate  
      },
      initialize: function() {
        this.addConnector('default');
      }
    });
  });