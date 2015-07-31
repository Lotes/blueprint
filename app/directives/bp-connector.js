angular
  .module('blueprint')
  .directive('bpConnector', function(registry) {
    return {
      templateNamespace: 'svg',
      restrict: 'A',
      require: '^bpNode',
      scope: {
        name: '@bpConnector',
      },
      link: function($scope, element, attrs, parentCtrl) {
        parentCtrl.addConnector($scope.name, element);        
      }
    };
  });