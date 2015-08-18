angular
  .module('blueprint')
  .directive('bpSelectable', function(bpSvg) {
    return {
      restrict: 'A',
      require: ['^bpEditor', '^bpModuleInstance'],
      scope: {
        data: '=bpSelectable',
        selectionChanged: '&onSelectionChanged',
      },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1];
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
            try {
              var localRect = element.getBBox();
              var localPosition = [localRect.x, localRect.y];
              var absolutePosition = bpSvg.getAbsolutePosition(element, localPosition);
              var absoluteRect = [absolutePosition[0], absolutePosition[1], localRect.width, localRect.height];
              if(bpSvg.rectIntersectsRect(selectionRect, absoluteRect)) 
                select(true);
            } catch(ex) {} //HACK: happens in Firefox if element is NOT_FOUND_ERR visible
          },
          'deleteSelection': function() {
            if($scope.isSelected 
               && (instanceController.isRoot() || instanceController.getModuleInstance() === $scope.data) //TODO that seems to be wrong!
               && $scope.data.remove
            ) {  
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