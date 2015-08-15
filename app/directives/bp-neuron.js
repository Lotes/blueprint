angular
  .module('blueprint')
  .directive('bpNeuron', function(bpSvg, bpEditorData) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['bpNeuron', '^bpEditor'],
      scope: {
        data: '=neuron',
        canEdit: '@editable'
      },
      controller: function($scope) { 
        $scope.isSelected = false;
        $scope.outerRadius = bpEditorData.config.neuron.outerRadius;
        $scope.innerRadius = bpEditorData.config.neuron.innerRadius;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
      },
      link: function($scope, $element, $attrs, controllers) {},
      templateUrl: 'app/directives/bp-neuron.template.xml'
    };
  });