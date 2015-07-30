angular
  .module('blueprint')
  .directive('bpProperties', function($window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        type: '=',
        data: '=map',
        entity: '=selection'
      },
      templateUrl: 'app/directives/bp-properties.template.html',
      controller: function($scope) {
        
      },
      link: function(scope, element, attrs) {
        scope.validate = function() {          
          var duplicate = false;
          var nodes = scope.data.nodes;
          for(var index = 0; !duplicate && index < nodes.length; index++)
            duplicate |= nodes[index] !== scope.entity && nodes[index.name] === scope.entity.name;
          scope.entity.name.$setValidity('duplicate', duplicate);
        };
      }
    };
  });