angular
  .module('blueprint')
  .factory('LayoutSize', function() {
    var regex = /^(\*|(\d+)(%|px)?)$/;
    return function(str) {
      if(!regex.test(str))
        throw new Error('This is not a valid layout size!');
      var match = regex.exec(str);
      this.fill = !match[2] && !match[3];
      this.value = parseInt(match[2]);
      this.isPercentage = match[3] === '%';
      //this.isPixel = !match[3] || match[3] === 'px';
      this.compute = function(parentSize, remainingSize) {
        remainingSize = remainingSize || parentSize;
        if(this.fill) return Math.floor(remainingSize);
        if(this.isPercentage) return Math.floor(this.value / 100 * parentSize);
        return Math.floor(this.value);
      };
    };
  })
  .directive('bpLayout', function($window, LayoutSize, $timeout) {
    return {
      restrict: 'E',
      require: ['?^bpPanel', 'bpLayout'],
      replace: true,
      transclude: true,
      scope: {
        w: '@width', //2%/10px/100/*
        h: '@height',
        splitting: '@split' //horizontal/vertical
      },
      templateUrl: 'app/directives/layout/bp-layout.template.html',
      controller: function($scope, $element) {
        var splitsHorizontally = $scope.splitting === 'horizontal';
        var parentElement = $element.parent()[0]; 
        
        var wSize = new LayoutSize($scope.w);
        var hSize = new LayoutSize($scope.h);
        
        $scope.computedWidth = 0;
        $scope.computedHeight = 0;

        var children = [];
        var self = this;
        this.addChild = function(controller) { 
          children.push(controller);
          self.resize();
        };  
        this.resize = function() {
          var width = $scope.computedWidth = wSize.compute(parentElement.offsetWidth);
          var height = $scope.computedHeight = hSize.compute(parentElement.offsetHeight);
          if(splitsHorizontally) {
            var x = 0;
            var remainingWidth = width;
            _.each(children, function(controller) {
              var sizer = controller.getSize();
              var size = sizer.compute(width, remainingWidth);
              controller.layout(x, 0, size, height);
              x += size;
              remainingWidth -= size;
            });
          } else {
            var y = 0;
            var remainingHeight = height;
            _.each(children, function(controller) {
              var sizer = controller.getSize();
              var size = sizer.compute(height, remainingHeight);
              controller.layout(0, y, width, size);
              y += size;
              remainingHeight -= size;
            });
          }
        };
      },
      link: function($scope, $element, $attrs, controllers) {
        var parentController = controllers[0];
        var thisController = controllers[1];
        //root layout triggers resize of its children
        if(!parentController) {
          function triggerResize() { 
            thisController.resize();
            $scope.$apply();
          }
          var w = angular.element($window);
          w.bind('resize', triggerResize);
          $scope.$on('$destroy', function() { w.unbind('resize', triggerResize); });
          $timeout(function triggerResize() { 
            thisController.resize();
          }, 100);
        } else
          parentController.addChild(thisController);
      }
    };
  });