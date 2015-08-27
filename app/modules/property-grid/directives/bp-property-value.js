angular
  .module('blueprint')
  .directive('bpPropertyValue', function($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=object',
        property: '=property',
        edit: '=selected'
      },
      template: '<div/>',
      controller: function($scope, $parse, $element) {
        var property = $scope.property;
        var object = $scope.data;
        var get = $parse(property.accessor);
        var set = get.assign;
        var $childScope = $scope.$new();
        
        $childScope.value = null;
        $childScope.readOnly = property.editor === null;
        
        function updateValue() {
          $childScope.value = get(object);  
        }
        function updateTemplate() {
          var template = property.view.template;
          if($scope.edit && !$childScope.readOnly)
            template = property.editor.template;
          $element.html(template);
          $compile($element.contents())($childScope);
        }
        
        $scope.template = property.view.template;
        $scope.$watch('data.'+property.accessor, updateValue);
        $scope.$watch('edit', updateTemplate);
        
        updateValue();
        updateTemplate();
      }
    };
  });