angular
  .module('blueprint')
  .directive('bpConnectableNode', function(bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '^bpModuleInstance', 'bpConnectableNode'],
      scope: {
        data: '=node',
        canEdit: '@editable'
      },
      controller: function($scope) { 
        var self = this;
        _.extend(self, Backbone.Events);
        $scope.$watch('data.position.coordinates', function() { self.trigger('change:position'); });
        
        $scope.isSelected = false;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
        
        var connectors = {};
        this.getNodeType = function() { return $scope.data.className; };
        this.addConnector = function(name, controller) { 
          connectors[name] = controller; 
          //console.log('add connector "'+name+'" to node "'+$scope.data.name+'"');
        };
        this.getConnector = function(name) { return connectors[name]; };
        this.removeConnector = function(name) { delete connectors[name]; };
      },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1]; 
        var connectableController = controllers[2]; 
        instanceController.addChild($scope.data.name, connectableController);
        $scope.$on('$destroy', function() {
          instanceController.removeChild($scope.data.name);
          connectableController.trigger('destroy');
        });
      },
      templateUrl: 'app/directives/bp-connectable-node.template.xml'
    };
  });