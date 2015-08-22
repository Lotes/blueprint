angular
  .module('blueprint')
  .directive('bpModuleInstance', function(RecursionHelper, bpSvg) {
    var link = function($scope, $element, $attrs, controllers) {
      var editorController = controllers[0];
      var parentController = controllers[1];
      var thisController = controllers[2];
      if(parentController != null) {
        parentController.addChild($scope.data.name, thisController);
        $scope.$on('$destroy', function() {
          parentController.removeChild($scope.data.name);
        });
      }
      thisController.getPath = function() { 
        var me = $scope.data.name != null ? [$scope.data.name] : [];
        if(parentController != null)
          return parentController.getPath().concat(me); 
        return me;
      };
    };    
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['^bpEditor', '?^^bpModuleInstance', 'bpModuleInstance'],
      scope: {
        data: '=instance',
        canEdit: '@editable'
      },
      controller: function($scope, $element) { 
        var self = this;
        
        $scope.convexHull = null;
        function updateHull() {
          if($scope.canEdit !== 'true')
            $scope.convexHull = self.getConvexHull();  
        }        
        
        this.isRoot = function() { return $scope.data.parentModule === null; };
        this.getModuleInstance = function() { return $scope.data; };
        this.getElement = function() { return $element[0]; };
        
        var childControllers = {};
        this.getNodeType = function() { return $scope.data.className; };
        this.addChild = function(name, controller) { childControllers[name] = controller; updateHull() };
        this.getChild = function(name) { return childControllers[name]; };
        this.removeChild = function(name) { delete childControllers[name]; updateHull(); };
        
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
        
        this.getPosition = function() { return $scope.data.position.toArray(); };
        this.getConvexHull = function() {
          var points = [];
          //merge node hulls
          _.each(childControllers, function(node) {
            var hull = node.getConvexHull();
            var relativePosition = node.getPosition();
            var relativeHull = _.map(hull, function(point) {
              return [
                relativePosition[0] + point[0],
                relativePosition[1] + point[1]
              ];  
            });
            points = points.concat(relativeHull);
          });
          //merge connection hulls
          //TODO
          //create convex hull        
          if(points.length <= 3)
            return points;
          return bpSvg.getConvexHull(points);  
        };
        
        $scope.isSelected = false;
        $scope.selectionChanged = function(selected) { $scope.isSelected = selected; };
      },
      templateUrl: 'app/directives/bp-module-instance.template.xml',
      compile: function(element) {
        return RecursionHelper.compile(element, link);
      }
    };
  });