angular
  .module('blueprint')
  .directive('bpConnection', function($filter, bpSvg, Anchor, Position, AnchorHandle) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '^bpModuleInstance'],
      scope: {
        data: '=connection',
        canEdit: '@editable'
      },
      templateUrl: 'app/directives/bp-connection.template.xml',
      link: function($scope, $element, $attrs, controllers) {
        $scope.canEdit = $scope.canEdit === 'true';
        
        var editorController = controllers[0];
        var instanceController = controllers[1]; 
        
        function getConnector(endPoint) {
          var path = endPoint.path;
          var connectorName = endPoint.connector;
          return instanceController.getConnector(path, connectorName);
        }
        var sourceConnector = getConnector($scope.data.source);
        var destinationConnector = getConnector($scope.data.destination);
        var sourceNode = sourceConnector.getNode();
        var destinationNode = destinationConnector.getNode();
        //anchors
        function updateSource() {
          var anchors = $scope.data.anchors;
          var anchorPosition = destinationConnector.getCenter();
          if(anchors.length > 0) {
            var first = anchors[0];
            anchorPosition = $filter('coordinateAdd')(first.position.toArray(), first.inHandle.position.toArray());
          }
          $scope.sourcePosition = sourceConnector.connectAt(anchorPosition);
        } 
        function updateDestination() {
          var anchors = $scope.data.anchors;
          var anchorPosition = sourceConnector.getCenter();
          if(anchors.length > 0) {
            var last = anchors[anchors.length - 1];
            anchorPosition = $filter('coordinateAdd')(last.position.toArray(), last.outHandle.position.toArray());
          }
          $scope.destinationPosition = destinationConnector.connectAt(anchorPosition);
        }
        function sourceUpdated() { 
          updateSource();
          if($scope.data.anchors.length == 0)
            updateDestination();
        }
        function destinationUpdated() {
          updateDestination();
          if($scope.data.anchors.length == 0)
            updateSource();  
        }
        updateSource();
        updateDestination();
        sourceNode.on('change:position', sourceUpdated);
        destinationNode.on('change:position', destinationUpdated);
        $scope.$watch('data.anchors[0].position.coordinates', updateSource);
        $scope.$watch('data.anchors[0].inHandle.position.coordinates', updateSource);
        $scope.$watch('data.anchors[data.anchors.length-1].position.coordinates', updateDestination);
        $scope.$watch('data.anchors[data.anchors.length-1].outHandle.position.coordinates', updateDestination);
        //endpoint nodes were deleted
        function removeMe() { $scope.data.remove(); }
        sourceNode.on('destroy', removeMe);
        destinationNode.on('destroy', removeMe);
        //destructor
        $scope.$on('$destroy', function() {
          sourceNode.off('change:position', sourceUpdated);
          destinationNode.off('change:position', destinationUpdated);  
        });
        //selection
        $scope.state = { isSelected: false };
        //add anchors
        $scope.onMouseDown = function($event, index) {
          if(editorController.getMode() !== 'anchor')
            return;
          var newPosition = bpSvg.getPositionInBoundingBox($event.target, [$event.offsetX, $event.offsetY]);          
          //TODO http://stackoverflow.com/questions/18655135/divide-bezier-curve-into-two-equal-halves
          //TODO what about quadratic curves?
          var newAnchor = new Anchor(newPosition[0], newPosition[1]);
          newAnchor.inHandle = new AnchorHandle(newAnchor, 100, 100);
          newAnchor.outHandle = new AnchorHandle(newAnchor, -100, -100);
          newAnchor.parentConnection = $scope.data;
          $scope.data.anchors.splice(index, 0, newAnchor);
        };
      }
    };
  });