angular
  .module('blueprint')
  .factory('ModuleInstance', function(Node) {
    return Node.extend({
      defaults: _.extend(Node.prototype.defaults, {
        module: null,
        //connectors, name, parentModule, position
      }),
      initialize: function() {
        Node.prototype.initialize.call(this, arguments);
      }
    });
  });