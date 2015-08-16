angular
  .module('blueprint')
  .directive('bpConnection', function($filter, bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '^bpModuleInstance', 'bpConnection'],
      scope: {
        data: '=connection',
        canEdit: '@editable'
      },
      templateUrl: 'app/directives/bp-connection.template.xml',
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1]; 
        var thisController = controllers[2]; 
        
        function getConnector(endPoint) {
          var path = endPoint.get('path');
          var connectorName = endPoint.get('connector');
          return instanceController.getConnector(path, connectorName);
        }
        var sourceConnector = getConnector($scope.data.get('source'));
        var destinationConnector = getConnector($scope.data.get('destination'));
        /*//selection
        $scope.state = { isSelected: false };
        //add anchors
        $scope.onMouseDown = function($event, index) {
          if(editorController.getMode() !== 'anchor')
            return;
          var newPosition = bpSvg.getPositionInBoundingBox($event.target, [$event.offsetX, $event.offsetY]);          
          //TODO http://stackoverflow.com/questions/18655135/divide-bezier-curve-into-two-equal-halves
          //TODO what about quadratic curves?
          $scope.data.anchors.splice(index, 0, {
            position: newPosition,
            'in': { position: [100,100] },
            'out': { position: [-100,-100] }
          });
        };*/
        //anchors
        /*var parentCtrl = editorController;
        function updateSource() {
          var anchors = $scope.data.get('anchors');
          var anchorPosition = 
            anchors.length > 0 ? 
              $filter('coordinateAdd')(anchors[0].position, anchors[0]['in'].position)
              : $scope.destination.position;
          $scope.sourcePosition = sourceConnectorController.connectAt(anchorPosition);
        } 
        function updateDestination() {
          var anchorPosition = 
            $scope.data.anchors && $scope.data.anchors.length > 0 ? 
              $filter('coordinateAdd')($scope.data.anchors[$scope.data.anchors.length-1].position, $scope.data.anchors[$scope.data.anchors.length-1]['out'].position)
              : $scope.source.position;
          $scope.destinationPosition = destinationConnectorController.connectAt(anchorPosition);
        }
        $scope.$watch('source.position', updateSource);
        $scope.$watch('destination.position', updateDestination);
        $scope.$watch('data.anchors[0].position', updateSource);
        $scope.$watch('data.anchors[0].in.position', updateSource);
        $scope.$watch('data.anchors[data.anchors.length-1].position', updateDestination);
        $scope.$watch('data.anchors[data.anchors.length-1].out.position', updateDestination);
        updateSource();
        updateDestination();*/
      }
    };
  });