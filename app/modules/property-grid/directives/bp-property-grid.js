angular
  .module('blueprint')
  .directive('bpPropertyGrid', function($window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=object',
        schema: '=properties'
      },
      templateUrl: 'app/modules/property-grid/templates/bp-property-grid.template.html',
      controller: function($scope) {
        $scope.isCategoryExpanded = {};
        $scope.categories = [];
        $scope.itemsByCategory = {};
        
        function update() {
          //update categories
          var categories = _.union(_.pluck($scope.schema, 'category'));
          categories.sort();
          _.each(categories, function(category) {
            if(!(category in $scope.isCategoryExpanded))
              $scope.isCategoryExpanded[category] = true;
          });
          $scope.categories = categories;
          
          //update items
          $scope.itemsByCategory = {};
          _.each(categories, function(category) {
            var items = _.filter($scope.schema, function(property) { return property.category === category; });
            $scope.itemsByCategory[category] = items;
          });
        }
        
        $scope.$watch('data', update);
        $scope.$watch('schema', update);
        update();
        
        $scope.toggleCategory = function(category) { $scope.isCategoryExpanded[category] = !$scope.isCategoryExpanded[category]; };
      },
      link: function($scope, $element, $attrs) {
        
      }
    };
  });