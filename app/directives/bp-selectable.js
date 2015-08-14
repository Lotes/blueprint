angular
  .module('blueprint')
  .directive('bpSelectable', function() {
    return {
      restrict: 'A',
      require: '^bpEditor',
      scope: {
        data: '=bpSelectable',
        selectionChanged: '&onSelectionChanged',
      },
      link: function($scope, $element, $attrs, editorController) {
        $scope.isSelected = false;
        function updateListeners() {
          $scope.selectionChanged({ $selected: $scope.isSelected });
        };
        $element.bind('mouseup', function(event) {
          event.preventDefault();
          editorController.select($scope.data);  
        });
        $scope.$on('select', function(event, selection) {          
          $scope.isSelected = selection === $scope.data;
          updateListeners();
          $scope.$apply();
        });
      }
    };
  });