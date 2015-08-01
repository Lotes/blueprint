angular
  .module('blueprint')
  .directive('bpConnection', function(registry) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpCanvas',
      scope: {
        data: '=connection', 
        nodes: '=',
      },
      controller: function($scope) {

      },
      link: function($scope, element, attrs, parentCtrl) {        
        $scope.source = $scope.nodes[$scope.data.source.node];
        $scope.destination = $scope.nodes[$scope.data.destination.node];
      },
      templateUrl: 'app/directives/bp-connection.template.xml'
    };
  });