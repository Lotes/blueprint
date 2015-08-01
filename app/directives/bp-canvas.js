angular
  .module('blueprint')
  .directive('bpCanvas', function($window, bpEditor) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=map',
      },
      templateUrl: 'app/directives/bp-canvas.template.xml',
      controller: function($scope) {        
       
      },
      link: function($scope, element, attrs) {
        //auto-resize canvas
        $scope.onResizeFunction = function() {
          $scope.height = $window.innerHeight;
          $scope.width = $window.innerWidth;
        };
        $scope.onResizeFunction();
        angular.element($window).bind('resize', function() {
          $scope.onResizeFunction();
          $scope.$apply();
        });
        //mouse events
        element.bind('mousemove', function(event) {
          $scope.$broadcast('mousemove', event);
        });
        element.bind('mousedown', function(event) {
          if(event.target.id == 'grid') {
            bpEditor.unselect();
            $scope.$apply();
          }
        });
      }
    };
  });