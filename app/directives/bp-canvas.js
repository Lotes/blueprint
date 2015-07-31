angular
  .module('blueprint')
  .directive('bpCanvas', function($window) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        isGridSnappingEnabled: '=snap',
        data: '=map',
        mode: '=',
        selectedNode: '=selection'
      },
      templateUrl: 'app/directives/bp-canvas.template.xml',
      controller: function($scope) {
        this.getMode = function() { return $scope.mode; };
        this.isEditing = function() { return $scope.mode == 'edit'; };
        this.snapToGrid = function(position) { 
          if(!$scope.isGridSnappingEnabled)
            return position;
          return [
            Math.round(position[0] / 25) * 25,
            Math.round(position[1] / 25) * 25
          ];
        };
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
        element.bind('mousedown', function(event) {
          if(event.target.id == 'grid'){ 
            scope.$broadcast('unselect'); 
            scope.selectedNode = null;
            scope.$apply();
          }
        });
      }
    };
  });