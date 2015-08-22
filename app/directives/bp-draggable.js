angular
  .module('blueprint')
  .directive('bpDraggable', function(bpSelectableDirective) {
    var parentDirective = bpSelectableDirective[0];
    var scope = angular.copy(parentDirective.scope, {});
    scope.data = '=bpDraggable'; //overwrites parent directive, must contain a .position (=[x,y]) property
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
        var isMouseDown = false;
        thisController.isDraggable = function() { return true; };
        thisController.startDragging = function() { oldDraggablePosition = $scope.data.position.toArray(); };
        thisController.stopDragging = function() { oldDraggablePosition = null; isMouseDown = false; };
        thisController.drag = function(delta) {
          var newDraggablePosition = [
            oldDraggablePosition[0] + delta[0],
            oldDraggablePosition[1] + delta[1]
          ];
          $scope.data.position.fromArray(newDraggablePosition);  
        };
        $element.bind('mousedown', function(event) {
          event.preventDefault();
          isMouseDown = true;
        });
        $element.bind('mousemove', function(event) {
          event.preventDefault();
          if(isMouseDown)
            editorController.startDragging($scope.data.position, event);
        });
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          isMouseDown = false;
          editorController.stopDragging();
        });
      }
    };
  });