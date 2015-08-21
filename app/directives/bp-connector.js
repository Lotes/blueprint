angular
  .module('blueprint')
  .directive('bpConnector', function(bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'A',
      require: ['^bpConnectableNode', 'bpConnector', '^bpModuleInstance'],
      scope: {
        name: '@bpConnector',
      },
      controller: function($scope, $element) {
        
      },
      link: function($scope, $element, $attrs, controllers) {
        var connectableController = controllers[0];
        var thisController = controllers[1];
        var instanceController = controllers[2];
        
        //register connector
        connectableController.addConnector($scope.name, thisController);
        $scope.$on('$destroy', function() {
          connectableController.removeConnector($scope.name);          
        });
        thisController.getNode = function() { return connectableController; };
        
        //define controller
        var circles = $element.find('circle');
        var element = circles.length > 0 ? circles[0] : $element[0];
        var instanceElement = instanceController.getElement();
        thisController.getCenter = function() {
          var box = element.getBBox();
          return bpSvg.getRelativePosition(element, instanceElement, [
            box.x + box.width / 2,
            box.y + box.height / 2
          ]);
        };
        thisController.connectAt = function(anchorPosition) {
          switch(element.nodeName) {
            case 'circle':             
              var localPosition = [element.cx.baseVal.value, element.cy.baseVal.value];
              var radius = element.r.baseVal.value;                
              var relativePosition = bpSvg.getRelativePosition(element, instanceElement, localPosition);
              var dx = relativePosition[0] - anchorPosition[0];
              var dy = relativePosition[1] - anchorPosition[1];
              var distance = Math.sqrt(dx*dx + dy*dy);
              var part = radius / distance;
              return [
                relativePosition[0] * (1-part) + anchorPosition[0] * part,
                relativePosition[1] * (1-part) + anchorPosition[1] * part
              ];
              break;
            default:
              return thisController.getCenter();
          }
        };
      }
    };
  });