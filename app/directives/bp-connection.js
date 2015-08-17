angular
  .module('blueprint')
  .directive('bpConnection', function($filter, bpSvg) {
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
          var path = endPoint.get('path');
          var connectorName = endPoint.get('connector');
          return instanceController.getConnector(path, connectorName);
        }
        var sourceConnector = getConnector($scope.data.get('source'));
        var destinationConnector = getConnector($scope.data.get('destination'));
        //anchors
        $scope.anchorSegments = [];
        function updateSegments() {
          var result = [];  
          var anchors = $scope.data.get('anchors');
          if(anchors.length > 0) {
            var first = anchors.at(0);
          
            result.push({
              type: 'Q',
              source: $scope.sourcePosition,  
              handle: $filter('coordinateAdd')(first.get('position').toArray(), first.get('inHandle').toArray()), 
              destination: first.get('position').toArray()
            });
            
            for(var index=1; index<anchors.length; index++) {
              var second = anchors.at(index);
              var sourcePosition = first.get('position').toArray();
              var destinationPosition = second.get('position').toArray();
              result.push({
                type: 'C',
                source: sourcePosition,  
                outHandle: $filter('coordinateAdd')(sourcePosition, first.get('outHandle').toArray()),
                inHandle: $filter('coordinateAdd')(destinationPosition, second.get('inHandle').toArray()),
                destination: destinationPosition
              });
              first = second;
            }
            
            var last = anchors.at(anchors.length-1);
            result.push({
              type: 'Q',
              source: last.get('position').toArray(),
              handle: $filter('coordinateAdd')(last.get('position').toArray(), last.get('outHandle').toArray()), 
              destination: $scope.destinationPosition
            });
          } else {
            result.push({
              type: 'L',
              source: $scope.sourcePosition,  
              destination: $scope.destinationPosition
            });
          }
          $scope.anchorSegments = result;
        }
        function updateSource() {
          var anchors = $scope.data.get('anchors');
          var anchorPosition = destinationConnector.getCenter();
          if(anchors.length > 0) {
            var first = anchors.at(0);
            anchorPosition = $filter('coordinateAdd')(first.get('position').toArray(), first.get('inHandle').toArray());
          }
          $scope.sourcePosition = sourceConnector.connectAt(anchorPosition);
        } 
        function updateDestination() {
          var anchors = $scope.data.get('anchors');
          var anchorPosition = sourceConnector.getCenter();
          if(anchors.length > 0) {
            var last = anchors.at(anchors.length - 1);
            anchorPosition = $filter('coordinateAdd')(last.get('position').toArray(), last.get('outHandle').toArray());
          }
          $scope.destinationPosition = destinationConnector.connectAt(anchorPosition);
        }
        $scope.data.get('anchors').on('change', function() {
            try { updateSegments(); } catch(ex) { }
            $scope.$apply();
        });
        updateSource();
        updateDestination();
        updateSegments();
        
        //selection
        $scope.state = { isSelected: false };
        /*//add anchors
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
      }
    };
  });