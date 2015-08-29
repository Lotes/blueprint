angular
  .module('blueprint')
  .directive('bpPropertyValue', function($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        reference: '=context',
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
        var Editor = property.editor;
        var View = property.view;
        $scope.readOnly = Editor === null;
        
        var $viewScope = $scope.$new();
        var $editorScope = $scope.$new();
        
        var view = new View($viewScope, $element);
        var editor = Editor === null ? null : new Editor($editorScope, $element);
        
        $editorScope.hasError = false;
        $editorScope.errorMessage = '';
        
        $viewScope.value = null;
        $editorScope.value = null;
        
        function validate(applyValue) {
          $editorScope.hasError = false;
          var validate = property.validate;
          switch(typeof(validate)) {
            case 'boolean':
              if(!validate) {
                $editorScope.hasError = true;
                $editorScope.errorMessage = 'All values are wrong ;D.';
                return;
              }
              break;
            case 'function':
              try { 
                validate($editorScope.value, object, $scope.reference); 
              } catch(ex) {
                $editorScope.hasError = true;
                $editorScope.errorMessage = ex.message;
                return;
              }
              break;
            default:
              $editorScope.hasError = true;
              $editorScope.errorMessage = 'No validator given!';
              return;
          }
          if(applyValue === true)
            set(object, $editorScope.value);
        }
        
        $editorScope.applyValue = function() { validate(true); };
        $editorScope.$watch('value', validate);
        
        function updateValue() {
          $viewScope.value = 
          $editorScope.value = get(object);  
        }
        function updateTemplate() {
          var template = view.template;
          if($scope.edit && !$scope.readOnly) {
            template = editor.template;
            $editorScope.value = $viewScope.value;
          } 
          if(!$scope.edit && !$scope.readOnly)
            validate(true);  
          $element.html(template);
          $compile($element.contents())($scope.edit ? $editorScope : $viewScope);
        }
        
        $scope.template = view.template;
        $scope.$watch('data.'+property.accessor, updateValue);
        $scope.$watch('edit', updateTemplate);
        
        updateValue();
        updateTemplate();
      }
    };
  });