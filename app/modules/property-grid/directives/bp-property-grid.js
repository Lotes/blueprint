angular
  .module('blueprint')
  .directive('bpPropertyGrid', function() {
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
        $scope.propertiesByCategory = {};
        
        function update() {
          //update categories
          var categories = _.union(_.pluck($scope.schema, 'category'));
          categories.sort();
          _.each(categories, function(category) {
            if(!(category in $scope.isCategoryExpanded))
              $scope.isCategoryExpanded[category] = true;
          });
          $scope.categories = categories;
          
          //selection
          $scope.selection = {
            category: null,
            name: null
          };
          $scope.select = function(category, name) {
            $scope.selection.category = category;
            $scope.selection.name = name;
          };
          
          //update items
          $scope.propertiesByCategory = {};
          _.each(categories, function(category) {
            var items = _.filter($scope.schema, function(property) { return property.category === category; });
            items.sort(function (a, b) {
                if (a.name < b.name) return 1;
                if (b.name < a.name) return -1;
                return 0;
            });
            $scope.propertiesByCategory[category] = items;
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