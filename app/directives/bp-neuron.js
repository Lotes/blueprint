angular
  .module('blueprint')
  .directive('bpNeuron', function(bpSvg, bpEditorData) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '^bpModuleInstance', 'bpNeuron'],
      scope: {
        data: '=neuron',
        canEdit: '@editable'
      },
      controller: function($scope) { 
        $scope.isSelected = false;
        $scope.outerRadius = bpEditorData.config.neuron.outerRadius;
        $scope.innerRadius = bpEditorData.config.neuron.innerRadius;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
        
        var connectors = {};
        this.getNodeType = function() { return $scope.data.get('className'); };
        this.addConnector = function(name, controller) { connectors[name] = controller; };
        this.getConnector = function(name) { return connectors[name]; };
        this.removeConnector = function(name) { delete connectors[name]; };
      },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1]; 
        var thisController = controllers[2]; 
        instanceController.addChild($scope.data.get('name'), thisController);
        $scope.$on('$destroy', function() {
          instanceController.removeChild($scope.data.get('name'), thisController);
        });
      },
      templateUrl: 'app/directives/bp-neuron.template.xml'
    };
  });