angular
  .module('blueprint')
  .directive('bpModuleInstance', function(RecursionHelper) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpEditor',
      scope: {
        data: '=instance',
        canEdit: '@editable'
      },
      controller: function($scope) { 
        this.isRoot = function() { return $scope.data.get('parentModule') === null; };
        this.getModuleInstance = function() { return $scope.data; };
        $scope.isSelected = false;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
        $scope.convexHull = null;
        if($scope.canEdit !== 'true') 
          $scope.convexHull = $scope.data.getConvexHull();
      },
      link: function($scope, $element, $attrs, editorController) {},
      templateUrl: 'app/directives/bp-module-instance.template.xml',
      compile: function(element) {
        return RecursionHelper.compile(element);
      }
    };
  });