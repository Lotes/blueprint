angular
  .module('blueprint')
  .directive('bpDraggable', function(bpSelectableDirective, registry) {
    var parentDirective = bpSelectableDirective[0];
    var scope = angular.copy(parentDirective.scope, {});
    scope.data = '=bpDraggable'; //overwrites parent directive, must contain a .position (=[x,y]) property
    scope.dragging = '&onDragging';
    scope.startDragging = '&onStartDragging';
    scope.stopDragging = '&onStopDragging';
    scope.snapping = '@inheritSnapping';
    return {
      restrict: 'A',
      require: '^bpCanvas',
      scope: scope,
      link: function($scope, $element, $attrs, editorController) {
        //call parent
        parentDirective.link.apply(parentDirective, arguments);
        //do dragging stuff
        var oldDraggablePosition = null;
        var oldMousePosition = null; 
        var isMouseDown = false;
        $element.bind('mousedown', function(event) {
          event.preventDefault();
          isMouseDown = true;
          oldMousePosition = [event.clientX, event.clientY];          
          oldDraggablePosition = $scope.data.position;          
        });
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          isMouseDown = false;
          oldDraggablePosition = null;
          oldMousePosition = null;          
        });
        $scope.$on('mousemove', function(event, args) {
          if(editorController.getMode() !== 'select' || !$scope.isSelected || oldMousePosition == null)
            return;
          args.preventDefault();
          var newMousePosition = [args.clientX, args.clientY];
          var newDraggablePosition = [0, 0];
          for(var index=0; index<2; index++) {
            var delta = newMousePosition[index] - oldMousePosition[index]; 
            newDraggablePosition[index] = oldDraggablePosition[index] + delta;
          }
          $scope.data.position = $scope.snapping === 'false' ? newDraggablePosition : editorController.snapPosition(newDraggablePosition);
          $scope.$apply();
        });
      }
    };
  });