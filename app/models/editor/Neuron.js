angular
  .module('blueprint')
  .factory('Neuron', function(Node, ConnectorCollection, Connector) {
    return Node.extend({
      defaults: _.extend(Node.prototype.defaults, {
        //connectors, name, parentModule, position
        type: 'activate' //activate, inhibit, associate, disassociate  
      }),
      initialize: function() {
        Node.prototype.initialize.call(this, arguments);
        this.addConnector('default');
      }
    });
  });