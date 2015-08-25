angular
  .module('blueprint')
  .directive('bpConnectableNode', function(bpSvg, bpEditorData) {
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
        
        self.getPosition = function() { return $scope.data.position.toArray(); };
        self.getConvexHull = function() { 
          var result = [];
          var radius = bpEditorData.config.neuron.outerRadius + 10;
          var parts = 24;
          for(var index=0; index<parts; index++)
            result.push([
              radius * Math.cos(index/parts * Math.PI * 2),
              radius * Math.sin(index/parts * Math.PI * 2)
            ]);
          return result;  
        };
        
        $scope.isSelected = false;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
        
        var connectors = {};
        self.getModel = function() { return $scope.data; };
        self.getNodeType = function() { return $scope.data.className; };
        self.addConnector = function(name, controller) { 
          connectors[name] = controller; 
          //console.log('add connector "'+name+'" to node "'+$scope.data.name+'"');
        };
        self.getConnector = function(name) { return connectors[name]; };
        self.removeConnector = function(name) { delete connectors[name]; };
      },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var instanceController = controllers[1]; 
        var connectableController = controllers[2]; 
        
        function notifyPositionChanged() {
          connectableController.trigger('change:position'); 
        }
        $scope.$watch('data.position.coordinates', notifyPositionChanged);
        instanceController.on('change:position', notifyPositionChanged);
        
        instanceController.addChild($scope.data.name, connectableController);
        $scope.$on('$destroy', function() {
          instanceController.removeChild($scope.data.name);
          instanceController.off('change:position', notifyPositionChanged);
          connectableController.trigger('destroy');
        });
        connectableController.getPath = function() { 
          return instanceController.getPath().concat([$scope.data.name]); 
        };
      },
      templateUrl: 'app/modules/editor/templates/bp-connectable-node.template.xml'
    };
  });