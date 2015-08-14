angular
  .module('blueprint')
  .directive('bpNeuron', function(bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['bpNeuron', '^bpEditor'],
      scope: {
        data: '=neuron'
      },
      controller: function($scope) { 
        $scope.isSelected = false;
        $scope.outerRadius = 15;
        $scope.innerRadius = 10;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
      },
      link: function($scope, $element, $attrs, controllers) {

      },
      templateUrl: 'app/directives/bp-neuron.template.xml'
    };
  });