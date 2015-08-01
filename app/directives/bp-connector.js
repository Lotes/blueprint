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
      link: function($scope, element, attrs, parentCtrl) {
        var name = $scope.name;
        parentCtrl.addConnector(name, element); 
      }
    };
  });