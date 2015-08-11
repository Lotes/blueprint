angular
  .module('blueprint')
  .factory('ModuleInstance', function(Node) {
    return Node.extend({
      defaults: {
        moduleName: null
      },
      initialize: function() {
        
      }
    });
  });