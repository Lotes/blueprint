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
        $scope.source = null;
        $scope.destination = null;
        $scope.$watch('[nodes.length,data.source.node,data.destination.node]', function() {
          alert("aa");
        });
      },
      templateUrl: 'app/directives/bp-connection.template.html'
    };
  });