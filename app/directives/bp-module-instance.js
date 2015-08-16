angular
  .module('blueprint')
  .directive('bpModuleInstance', function(RecursionHelper) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '^bpModuleInstance', 'bpModuleInstance'],
      scope: {
        data: '=instance',
        canEdit: '@editable'
      },
      controller: function($scope, $element) { 
        var self = this;
        
        this.isRoot = function() { return $scope.data.get('parentModule') === null; };
        this.getModuleInstance = function() { return $scope.data; };
        this.getElement = function() { return $element[0]; };
        
        var childControllers = {};
        this.getNodeType = function() { return $scope.data.get('className'); };
        this.addChild = function(name, controller) { childControllers[name] = controller; };
        this.getChild = function(name) { return childControllers[name]; };
        this.removeChild = function(name) { delete childControllers[name]; };
        
        this.getConnector = function(nodePath, connectorName) {
          var nodeController = self; 
          _.each(nodePath, function(nodeName) {
            if(nodeController.getNodeType() !== 'ModuleInstance')
              throw new Error('Node controller must be a module instance!');
            nodeController = nodeController.getChild(nodeName);
          });
          if(nodeController.getNodeType() === 'ModuleInstance')
            throw new Error('Node controller must not be a module instance!');
          return nodeController.getConnector(connectorName);
        };
        
        $scope.isSelected = false;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
        $scope.convexHull = null;
        if($scope.canEdit !== 'true') 
          $scope.convexHull = $scope.data.getConvexHull();
      },
      link: function($scope, $element, $attrs, controllers) {
        var editorController = controllers[0];
        var parentController = controllers[1];
        var thisController = controllers[2];
        parentController.addChild($scope.data.get('name'), thisController);
        $scope.$on('$destroy', function() {
          parentController.removeChild($scope.data.get('name'), thisController);
        });
      },
      templateUrl: 'app/directives/bp-module-instance.template.xml',
      compile: function(element) {
        return RecursionHelper.compile(element);
      }
    };
  });