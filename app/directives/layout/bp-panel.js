angular
  .module('blueprint')
  .directive('bpPanel', function(LayoutSize) {
    return {
      restrict: 'E',
      require: ['^bpLayout', 'bpPanel'],
      replace: true,
      transclude: true,
      scope: {
        s: '@size', //2%/10px/100/*
        resizing: '&onResize'
      },
      templateUrl: 'app/directives/layout/bp-panel.template.html',
      controller: function($scope, $element) {
        var children = [];
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
          _.each(children, function(controller) { controller.resize(); });
          $scope.resizing({ 
            $width: w,
            $height: h 
          });
        };
        this.addChild = function(controller) {
          children.push(controller);
        };
      },
      link: function($scope, $element, $attrs, controllers) {
        var parentController = controllers[0];  
        var thisController = controllers[1];  
        parentController.addChild(thisController);
      }
    };
  });