angular
  .module('blueprint')
  .directive('bpAnchor', function(registry, bpEditor) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpCanvas',
      scope: {
        data: '=anchor',
      },
      templateUrl: 'app/directives/bp-anchor.template.xml',      
      controller: function($scope) {
        var oldNodePosition = null;
        var oldMousePosition = null;        
        $scope.isMouseDown = false;
        $scope.isActive = false;
        $scope.onMouseDown = function(event) {
          $scope.isMouseDown = true;
          oldMousePosition = [event.clientX, event.clientY];          
          oldNodePosition = $scope.data.position;
          event.preventDefault();
        };
        $scope.onMouseUp = function(event) {
          $scope.isMouseDown = false;
          oldNodePosition = null;
          oldMousePosition = null;          
        };
        $scope.onMouseEnter = function(event) {
          $scope.isActive = true;
        };
        $scope.onMouseLeave = function(event) {
          $scope.isActive = false;
          $scope.isMouseDown = false;
        };
        $scope.$on('mousemove', function(event, args) {
          if(bpEditor.mode != 'select' || oldMousePosition == null)
            return;
          args.preventDefault();
          var newMousePosition = [args.clientX, args.clientY];
          var newNodePosition = [0, 0];
          for(var index=0; index<2; index++) {
            var delta = newMousePosition[index] - oldMousePosition[index]; 
            newNodePosition[index] = oldNodePosition[index] + delta;
          }
          $scope.$apply(function() {
            $scope.data.position = bpEditor.snapPosition(newNodePosition);
          });          
        });
      }
    };
  });