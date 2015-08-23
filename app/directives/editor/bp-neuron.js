angular
  .module('blueprint')
  .directive('bpNeuron', function(bpSvg, bpEditorData) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '^bpModuleInstance', '^bpConnectableNode'],
      scope: {
        data: '=neuron',
        canEdit: '@editable'
      },
      controller: function($scope) { 
        $scope.outerRadius = bpEditorData.config.neuron.outerRadius;
        $scope.innerRadius = bpEditorData.config.neuron.innerRadius;
      },
      link: function($scope, $element, $attrs, controllers) {
        
      },
      templateUrl: 'app/directives/editor/bp-neuron.template.xml'
    };
  });