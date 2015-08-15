angular
  .module('blueprint')
  .directive('bpSelectable', function(bpSvg) {
    return {
      restrict: 'A',
      require: '^bpEditor',
      scope: {
        data: '=bpSelectable',
        selectionChanged: '&onSelectionChanged',
      },
      link: function($scope, $element, $attrs, editorController) {
        $scope.isSelected = false;
        function select(value) {
          $scope.isSelected = value;
          $scope.selectionChanged({ $selected: $scope.isSelected });
          $scope.$apply();  
        };
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          if(!event.shiftKey && !event.metaKey)
            editorController.trigger('unselect');
          select(true);
        });
        var editorEvents = {
          'unselect': function() {
            select(false);
          },
          'selectRectangle': function(selectionRect) {          
            var element = $element[0];
            var localRect = element.getBBox();
            var localPosition = [localRect.x, localRect.y];
            var absolutePosition = bpSvg.getAbsolutePosition(element, localPosition);
            var absoluteRect = [absolutePosition[0], absolutePosition[1], localRect.width, localRect.height];
            if(bpSvg.rectIntersectsRect(selectionRect, absoluteRect)) 
              select(true);
          },
          'deleteSelection': function() {
            if($scope.isSelected && $scope.data.remove) {  
              $scope.data.remove();
              $scope.$apply();
            }
          }
        };
        for(var eventName in editorEvents)
          editorController.on(eventName, editorEvents[eventName]);
        $scope.$on('$destroy', function() {
          for(var eventName in editorEvents)
            editorController.off(eventName, editorEvents[eventName]);  
        });
      }
    };
  });