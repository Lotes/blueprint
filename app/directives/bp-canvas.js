angular
  .module('blueprint')
  .directive('bpCanvas', function($window, bpEditor) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=map',
        snapToGrid: '=snapping'
      },
      templateUrl: 'app/directives/bp-canvas.template.xml',
      controller: function($scope, $element) {        
        var self = this;
        var nodeControllers = {};
        this.addNode = function(id, controller) { 
          nodeControllers[id] = controller; 
        };
        this.removeNode = function(id) { 
          delete nodeControllers[id]; 
        };
        this.getNode = function(id) { 
          return nodeControllers[id]; 
        };
        //mode
        $scope.mode = 'select';
        this.getMode = function() { return $scope.mode; };
        this.setMode = function(mode) { return $scope.mode = mode; };
        this.snapPosition = function(position) { 
          if(!$scope.snapToGrid)
            return position;
          return [
            Math.round(position[0] / 25) * 25,
            Math.round(position[1] / 25) * 25
          ];
        };
        //selection
        $scope.selectionType = null;
        $scope.selection = null;
        this.select = function(type, node) { 
          $scope.selectionType = type;
          $scope.selection = node;
          $scope.$broadcast('select', node);
        };        
        //auto-resize canvas
        var parent = $element.parent()[0];
        $scope.onResizeFunction = function() {
          $scope.height = parent.clientHeight;
          $scope.width = parent.clientWidth;
        };
        $scope.onResizeFunction();
        angular.element($window).bind('resize', function() {
          $scope.onResizeFunction();
          $scope.$apply();
        });
        //mouse events
        $element.bind('mousemove', function(event) {
          $scope.$broadcast('mousemove', event);
        });
        $element.bind('mousedown', function(event) {
          if(event.target.id != 'grid')
            return;
          switch(bpEditor.mode) {
            case 'quad':
            case 'neuron':
              var position = [event.offsetX, event.offsetY];
              var newId = 0;
              var duplicate;
              do {
                newId++;
                duplicate = false
                for(var name in $scope.data.nodes)  
                  if(newId == name)
                    duplicate = true;
              } while(duplicate);                
              $scope.data.nodes[newId] = {
                label: 'New',
                templateName: bpEditor.mode,
                position: position                
              };
              $scope.$apply();
              break;
            default:
              self.select(null);
              $scope.$apply();
          }          
        });
      }
    };
  });