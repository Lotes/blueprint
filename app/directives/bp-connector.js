angular
  .module('blueprint')
  .directive('bpConnector', function(registry, bpEditor) {
    return {
      templateNamespace: 'svg',
      restrict: 'A',
      require: '^bpNode',
      scope: {
        name: '@bpConnector',
      },
      controller: function($scope, $element) {
        var parentCtrl = $element.controller('bpNode');
        parentCtrl.addConnector($scope.name, $element);
      }
    };
  });