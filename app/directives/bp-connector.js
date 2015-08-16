angular
  .module('blueprint')
  .directive('bpConnector', function(bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'A',
      require: ['^bpNeuron', 'bpConnector'],
      scope: {
        name: '@bpConnector',
      },
      controller: function($scope, $element) {
        var circles = $element.find('circle');
        var element = circles.length > 0 ? circles[0] : $element[0];
        this.connectAt = function(anchorPosition) {
          switch(element.nodeName) {
            case 'circle':             
              var relativePosition = [element.cx.value, element.cy.value];
              var radius = element.r.value;                
              var absolutePosition = bpSvg.getAbsolutePosition(element);
              var dx = absolutePosition[0] - anchorPosition[0];
              var dy = absolutePosition[1] - anchorPosition[1];
              var distance = Math.sqrt(dx*dx + dy*dy);
              var part = radius / distance;
              return [
                absolutePosition[0] * part + anchorPosition[0] * (1-part),
                absolutePosition[1] * part + anchorPosition[1] * (1-part)
              ];
              break;
            default:
              var box = element.getBBox();
              return [
                box.x + box.width / 2,
                box.y + box.height / 2
              ];
          }
        };
      },
      link: function($scope, $element, $attrs, controllers) {
        var neuronController = controllers[0];
        var connectorController = controllers[1];
        neuronController.addConnector($scope.name, connectorController);
        $scope.$on('$destroy', function() {
          neuronController.removeConnector($scope.name);          
        });
      }
    };
  });