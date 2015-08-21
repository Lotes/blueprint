angular
  .module('blueprint')
  .directive('bpSelectable', function(bpSvg) {
    return {
      restrict: 'A',
      require: ['^bpEditor', '^bpModuleInstance', 'bpSelectable'],
      scope: {
        data: '=bpSelectable',
        selectionChanged: '&onSelectionChanged',
      },
      controller: function() {},
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1];
        var thisController = controllers[2];
        
        $scope.isSelected = false;
        
        thisController.isSelected = function() { return $scope.isSelected; };
        thisController.canSelect = function(selectionRect) {
          var element = $element[0];
          try {
            var localRect = element.getBBox();
            var localPosition = [localRect.x, localRect.y];
            var absolutePosition = bpSvg.getAbsolutePosition(element, localPosition);
            var absoluteRect = [absolutePosition[0], absolutePosition[1], localRect.width, localRect.height];
            if(bpSvg.rectIntersectsRect(selectionRect, absoluteRect)) 
              return true;
          } catch(ex) { } //HACK: happens in Firefox if element is not visible  
          return false;
        };
        thisController.select = function(selected) {
          $scope.isSelected = selected;
          $scope.selectionChanged({ $selected: $scope.isSelected });  
        };
        thisController.remove = function() { 
          if($scope.data.remove) 
            $scope.data.remove(); 
        };
        
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          editorController.selectObject(thisController, event.shiftKey || event.metaKey)
          $scope.$apply();
        });
        
        editorController.registerSelectable(thisController);
        $scope.$on('$destroy', function() {
          editorController.unregisterSelectable(thisController);
        });
      }
    };
  });