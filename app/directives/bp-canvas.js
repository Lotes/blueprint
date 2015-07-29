angular
  .module('blueprint')
  .directive('bpCanvas', function($window) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        data: '=map',
        mode: '=',
        selectedNode: '=selection'
      },
      templateUrl: 'app/directives/bp-canvas.template.html',
      controller: function($scope) {
        this.getMode = function() { return $scope.mode; };
        this.isEditing = function() { return $scope.mode == 'edit'; };
        this.isRunning = function() { return $scope.mode == 'run'; };
        this.unselect = function() { 
          $scope.$broadcast('unselect'); 
          $scope.selectedNode = null;
        };
        this.selectNode = function(node) { 
          $scope.selectedNode = node;  
        };
      },
      link: function(scope, element, attrs) {
        //auto-resize canvas
        scope.onResizeFunction = function() {
          scope.height = $window.innerHeight;
          scope.width = $window.innerWidth;
        };
        scope.onResizeFunction();
        angular.element($window).bind('resize', function() {
          scope.onResizeFunction();
          scope.$apply();
        });
        //mouse events
        element.bind('mousemove', function(event) {
          scope.$broadcast('mousemove', event);
        });
      }
    };
  });