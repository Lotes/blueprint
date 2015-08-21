angular
  .module('blueprint')
  .directive('bpDraggable', function(bpSelectableDirective) {
    var parentDirective = bpSelectableDirective[0];
    var scope = angular.copy(parentDirective.scope, {});
    scope.data = '=bpDraggable'; //overwrites parent directive, must contain a .position (=[x,y]) property
    scope.dragging = '&onDragging';
    scope.startDragging = '&onStartDragging';
    scope.stopDragging = '&onStopDragging';
    scope.snapping = '@inheritSnapping';
    return {
      restrict: 'A',
      require: ['^bpEditor', '^bpModuleInstance', 'bpDraggable'],
      scope: scope,
      controller: function() {
        parentDirective.controller.apply(parentDirective, arguments);
      },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1];
        var thisController = controllers[2];
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
          oldDraggablePosition = $scope.data.position.toArray();          
        });
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          isMouseDown = false;
          oldDraggablePosition = null;
          oldMousePosition = null;          
        });
        editorController.on('select:mousemove', function(event) {
          if(editorController.getMode() !== 'select' || !$scope.isSelected || oldMousePosition == null)
            return;
          event.preventDefault();
          var newMousePosition = [event.clientX, event.clientY];
          var newDraggablePosition = [0, 0];
          for(var index=0; index<2; index++) {
            var delta = newMousePosition[index] - oldMousePosition[index]; 
            newDraggablePosition[index] = oldDraggablePosition[index] + delta;
          }
          $scope.data.position.fromArray($scope.snapping === 'false' ? newDraggablePosition : editorController.snapPosition(newDraggablePosition));
          $scope.$apply();
        });
      }
    };
  });