angular
  .module('blueprint')
  .directive('bpAnchor', function() {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      require: ['^bpEditor', 'bpAnchor'],
      replace: true,
      scope: {
        data: '=anchor'
      },
      templateUrl: 'app/directives/editor/bp-anchor.template.xml',
      controller: function() { _.extend(this, Backbone.Events); },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var thisController = controllers[1];
        $scope.size = 10;
        $scope.selections = {};
        $scope.isSelected = false;
        $scope.selectionChanged = function(point, selected) {
          $scope.selections[point] = selected;          
          $scope.isSelected = false;
          if(editorController.getMode() === 'select')
              for(var name in $scope.selections)
                $scope.isSelected |= $scope.selections[name];
        };
        function align(me) {
          var you = me === 'inHandle' ? 'outHandle' : 'inHandle';
          var myData = $scope.data[me];
          var yourData = $scope.data[you];
          var myRelative = myData.position.toArray();
          var yourRelative = yourData.position.toArray();
          var myDistance = Math.sqrt(myRelative[0]*myRelative[0] + myRelative[1]*myRelative[1]);
          var yourDistance = Math.sqrt(yourRelative[0]*yourRelative[0] + yourRelative[1]*yourRelative[1]);
          var part = myDistance / yourDistance;
          myData.position.fromArray([
            yourRelative[0] * (-part),
            yourRelative[1] * (-part)
          ]);
        }
        $scope.$watch('data.inHandle.position.coordinates', function() { if($scope.selections['inHandle']) align('outHandle'); });
        $scope.$watch('data.outHandle.position.coordinates', function() { if($scope.selections['outHandle']) align('inHandle'); });
        $scope.$on('$destroy', function() { thisController.trigger('destroy'); }); //TODO needed for?
      }
    };
  });