angular
  .module('blueprint')
  .directive('bpSelectable', function(registry, bpEditor) {
    return {
      restrict: 'A',
      scope: {
        type: '@selectionType',
        data: '=bpSelectable'
      },
      controller: function($scope, $element) {
        var oldNodePosition = null;
        var oldMousePosition = null; 
        var state = $scope.state = {};
        state.isSelected = false;
        state.isMouseDown = false;
        state.isActive = false;
        $scope.$watch('state.isActive', function() {
          if(state.isActive)
            $element.addClass('active');
          else
            $element.removeClass('active');
        });
        $scope.$watch('state.isSelected', function() {
          if(state.isSelected)
            $element.addClass('selected');
          else
            $element.removeClass('selected');
        });
        $element.bind('mousedown', function(event) {
          state.isMouseDown = true;
          oldMousePosition = [event.clientX, event.clientY];          
          if($scope.data.position)
            oldNodePosition = $scope.data.position;          
          event.preventDefault();
          $scope.$apply();
        });
        $element.bind('mouseup', function(event) {
          state.isMouseDown = false;
          oldNodePosition = null;
          oldMousePosition = null;          
          bpEditor.unselect();
          bpEditor.select($scope.type, $scope.data);          
          state.isSelected = true;
          event.preventDefault();
          $scope.$apply();
        });
        $element.bind('mouseenter', function(event) {
          state.isActive = true;
          $scope.$apply();
        });
        $element.bind('mouseleave', function(event) {
          state.isActive = false;
          state.isMouseDown = false;
          $scope.$apply();
        });
        $scope.$on('unselect', function() { 
          state.isSelected = false; 
        });
        if($scope.data.position)
          $scope.$on('mousemove', function(event, args) {
            if(bpEditor.mode != 'select' || !state.isSelected || oldMousePosition == null)
              return;
            args.preventDefault();
            var newMousePosition = [args.clientX, args.clientY];
            var newNodePosition = [0, 0];
            for(var index=0; index<2; index++) {
              var delta = newMousePosition[index] - oldMousePosition[index]; 
              newNodePosition[index] = oldNodePosition[index] + delta;
            }
            $scope.data.position = bpEditor.snapPosition(newNodePosition);
            $scope.$apply();
          });
      }
    };
  });