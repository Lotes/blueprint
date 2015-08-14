angular
  .module('blueprint')
  .directive('bpEditor', function($window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=module',
        mode: '=',
        snapToGrid: '=snapping',
        selection: '='
      },
      templateUrl: 'app/directives/bp-editor.template.xml',
      controller: function($scope, $element) {        
        //mode
        this.getMode = function() { return $scope.mode; };
        this.setMode = function(mode) { return $scope.mode = mode; };
        this.snapPosition = function(position) { 
          if(!$scope.snapToGrid)
            return position;
          return [
            Math.round(position[0] / 25) * 25,
            Math.round(position[1] / 25) * 25
          ];
        };
        //selection
        this.select = function(node) { 
          $scope.selection = node;
          $scope.$broadcast('select', node);
        };
        this.deleteSelection = function() {
          
        };
        //auto-resize canvas
        var parent = $element.parent()[0];
        $scope.onResizeFunction = function() {
          $scope.height = parent.clientHeight;
          $scope.width = parent.clientWidth;
        };
        $scope.onResizeFunction();
        angular.element($window).bind('resize', function() {
          $scope.onResizeFunction();
          $scope.$apply();
        });
        //key events
        Mousetrap.bind('del', function() { 
          if($scope.mode !== 'select')
            return;
          self.deleteSelection();
        }, 'keydown');        
      }
    };
  });