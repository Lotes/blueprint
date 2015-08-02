angular
  .module('blueprint')
  .directive('bpAnchor', function(registry, bpEditor) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      scope: {
        data: '=anchor'
      },
      templateUrl: 'app/directives/bp-anchor.template.xml',
      controller: function($scope, $element) {
        var selections = {};
        $scope.size = 6;  
        $scope.selected = false;
        $scope.selectionChanged = function(point, selected) {
          selections[point] = selected;          
          $scope.selected = false;
          if(bpEditor.mode === 'select')
              for(var name in selections)
                $scope.selected |= selections[name];
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
        $scope.$watch('data.in.position', function() { if(selections['in']) align('out'); });
        $scope.$watch('data.out.position', function() { if(selections['out']) align('in'); });
      }
    };
  });