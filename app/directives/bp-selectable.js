angular
  .module('blueprint')
  .directive('bpSelectable', function(registry) {
    return {
      restrict: 'A',
      require: '^bpCanvas',
      scope: {
        type: '@selectionType',
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
          editorController.select($scope.type, $scope.data);  
        });
        $scope.$on('select', function(event, selection) {          
          $scope.isSelected = selection === $scope.data;
          updateListeners();
          $scope.$apply();
        });
      }
    };
  });