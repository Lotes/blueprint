angular
  .module('blueprint')
  .directive('bpSelectable', function(registry, bpEditor) {
    return {
      restrict: 'A',
      scope: {
        type: '@selectionType',
        data: '=bpSelectable',
        selectionChanged: '&onSelectionChanged',
        snapping: '@inheritSnapping'
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
          if($scope.selectionChanged)
            $scope.selectionChanged({ $selected: state.isSelected });
        });
        $element.bind('mousedown', function(event) {
          event.preventDefault();
          state.isMouseDown = true;
          oldMousePosition = [event.clientX, event.clientY];          
          if($scope.data.position)
            oldNodePosition = $scope.data.position;          
          $scope.$apply();
        });
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          state.isMouseDown = false;
          oldNodePosition = null;
          oldMousePosition = null;          
          bpEditor.unselect();
          bpEditor.select($scope.type, $scope.data);          
          state.isSelected = true;          
          $scope.$apply();
        });
        $element.bind('mouseenter', function(event) {
          event.preventDefault();
          state.isActive = true;
          $scope.$apply();
        });
        $element.bind('mouseleave', function(event) {
          event.preventDefault();
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
            $scope.data.position = $scope.snapping === 'false' ? newNodePosition : bpEditor.snapPosition(newNodePosition);
            $scope.$apply();
          });
      }
    };
  });