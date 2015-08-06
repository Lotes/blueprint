angular
  .module('blueprint')
  .directive('bpConnection', function(registry, bpEditor) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpCanvas',
      scope: {
        data: '=connection', 
        nodes: '=',
      },
      controller: function($scope, $element, $filter) {
        //selection
        $scope.state = { isSelected: false };
        //anchors
        var parentCtrl = $element.controller('bpCanvas');
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