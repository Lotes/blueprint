angular
  .module('blueprint')
  .directive('bpSplitter', function(LayoutSize) {
    return {
      restrict: 'E',
      require: ['^bpLayout', 'bpSplitter'],
      replace: true,
      scope: {
        s: '@size'  
      },
      templateUrl: 'app/modules/layout/templates/bp-splitter.template.html',
      controller: function($scope, $element) {
        var size = new LayoutSize($scope.s);
        $scope.computedLeft = 0;
        $scope.computedTop = 0;
        $scope.computedWidth = 0;
        $scope.computedHeight = 0;
        this.getSize = function() { return size; };
        this.layout = function(x, y, w, h) {
          $scope.computedLeft = x;
          $scope.computedTop = y; 
          $scope.computedWidth = w;
          $scope.computedHeight = h;
        };
      },
      link: function($scope, $element, $attrs, controllers) {
        var parentController = controllers[0];  
        var thisController = controllers[1];  
        parentController.addChild(thisController);  
        $element.addClass(parentController.splitsHorizontally() ? 'layout-splitter-horizontal' : 'layout-splitter-vertical');
      }
    };
  });