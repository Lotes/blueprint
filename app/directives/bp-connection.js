angular
  .module('blueprint')
  .directive('bpConnection', function(registry, $filter, bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpEditor',
      scope: {
        data: '=connection', 
        nodes: '=',
      },
      link: function($scope, $element, $attrs, editorController) {
        //selection
        $scope.state = { isSelected: false };
        //add anchors
        $scope.onMouseDown = function($event, index) {
          if(editorController.getMode() !== 'anchor')
            return;
          console.log($event);
          var newPosition = bpSvg.getPositionInBoundingBox($event.target, [$event.offsetX, $event.offsetY]);          
          //TODO http://stackoverflow.com/questions/18655135/divide-bezier-curve-into-two-equal-halves
          //TODO what about quadratic curves?
          $scope.data.anchors.splice(index, 0, {
            position: newPosition,
            'in': { position: [100,100] },
            'out': { position: [-100,-100] }
          });
        };
        //anchors
        var parentCtrl = $element.controller('bpEditor');
        var sourceId = $scope.data.source.node;
        var destinationId = $scope.data.destination.node;
        var sourceConnector = $scope.data.source.connector;
        var destinationConnector = $scope.data.destination.connector;
        var sourceNodeController = parentCtrl.getNode(sourceId);
        var destinationNodeController = parentCtrl.getNode(destinationId);
        var sourceConnectorController = sourceNodeController.getConnector(sourceConnector);
        var destinationConnectorController = destinationNodeController.getConnector(destinationConnector);
        $scope.source = $scope.nodes[sourceId];
        $scope.destination = $scope.nodes[destinationId];  
        function updateSource() {
          var anchorPosition = 
            $scope.data.anchors && $scope.data.anchors.length > 0 ? 
              $filter('coordinateAdd')($scope.data.anchors[0].position, $scope.data.anchors[0]['in'].position)
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
        updateDestination();
      },
      templateUrl: 'app/directives/bp-connection.template.xml'
    };
  });