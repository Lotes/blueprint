angular
  .module('blueprint')
  .directive('bpCanvas', function($window) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {},
      templateUrl: 'app/directives/bp-canvas.template.html',
      link: function postLink(scope, element, attrs) {
        scope.onResizeFunction = function() {
          scope.height = $window.innerHeight;
          scope.width = $window.innerWidth;
        };
        //call to the function when the page is first loaded
        scope.onResizeFunction();
        angular.element($window).bind('resize', function() {
          scope.onResizeFunction();
          scope.$apply();
        });
      }
    };
  });