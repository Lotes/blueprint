angular
  .module('blueprint')
  .directive('bpAnchor', function(registry) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      require: '^bpCanvas',
      replace: true,
      scope: {
        data: '=anchor'
      },
      templateUrl: 'app/directives/bp-anchor.template.xml',
      link: function($scope, $element, $attrs, editorController) {
        $scope.selections = {};
        $scope.size = 6;  
        $scope.isSelected = false;
        $scope.selectionChanged = function(point, selected) {
          $scope.selections[point] = selected;          
          $scope.isSelected = false;
          if(editorController.getMode() === 'select')
              for(var name in $scope.selections)
                $scope.isSelected |= $scope.selections[name];
          console.log($scope.selections);
        };
        function align(me) {
          var you = me === 'in' ? 'out' : 'in';
          var myData = $scope.data[me];
          var yourData = $scope.data[you];
          var myRelative = myData.position;
          var yourRelative = yourData.position;
          var myDistance = Math.sqrt(myRelative[0]*myRelative[0] + myRelative[1]*myRelative[1]);
          var yourDistance = Math.sqrt(yourRelative[0]*yourRelative[0] + yourRelative[1]*yourRelative[1]);
          var part = myDistance / yourDistance;
          myData.position = [
            yourRelative[0] * (-part),
            yourRelative[1] * (-part)
          ];
        }
        $scope.$watch('data.in.position', function() { if($scope.selections['in']) align('out'); });
        $scope.$watch('data.out.position', function() { if($scope.selections['out']) align('in'); });
      }
    };
  });