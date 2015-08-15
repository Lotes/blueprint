angular
  .module('blueprint')
  .directive('bpEditor', function($window, Position, ModuleInstance, bpSvg) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=module',
        mode: '=',
        snapToGrid: '=snapping',
        selection: '='
      },
      templateUrl: 'app/directives/bp-editor.template.xml',
      controller: function($scope, $element) {     
        var self = this;
        _.extend(self, Backbone.Events);
        //root object
        $scope.rootInstance = new ModuleInstance({
          module: $scope.data,
          name: null,
          parentModule: null,
          position: new Position({ x: 0, y: 0 })
        });
        //mode
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
        //key events
        Mousetrap.bind('del', function() { 
          if($scope.mode !== 'select')
            return;
          self.deleteSelection();
        }, 'keydown');        
        //mouse events
        var events = ['mousedown', 'mousemove', 'mouseup'];
        _.each(events, function(eventName) {
          $element.bind(eventName, function(event) {
            self.trigger($scope.mode+':'+eventName, event);
          });  
        });
        //selection
        var selectionStart = [0, 0];
        $scope.showSelectionRectangle = false;
        $scope.selectionRectangle = [0, 0, 0, 0]; //x, y, w, h
        self.on('select:mousedown', function(event) { 
          event.preventDefault();
          if(!angular.element(event.target).hasClass('grid'))
            return;
          selectionStart = [event.offsetX, event.offsetY];
          $scope.selectionRectangle = [selectionStart[0], selectionStart[1], 0, 0];
          $scope.showSelectionRectangle = true;
          $scope.$apply();
        });
        self.on('select:mousemove', function(event) { 
          if(!$scope.showSelectionRectangle)
            return;
          event.preventDefault();
          var currentPosition = [event.offsetX, event.offsetY];
          var width = Math.abs(currentPosition[0]-selectionStart[0]);
          var height = Math.abs(currentPosition[1]-selectionStart[1]);
          var x = Math.min(currentPosition[0], selectionStart[0]);
          var y = Math.min(currentPosition[1], selectionStart[1]);
          $scope.selectionRectangle = [x, y, width, height];
          $scope.$apply();
        });
        self.on('select:mouseup', function(event) { 
          if(!$scope.showSelectionRectangle)
            return;
          self.trigger('unselect');
          event.preventDefault();
          self.trigger('selectRectangle', $scope.selectionRectangle);
          $scope.showSelectionRectangle = false; 
          $scope.$apply();
        });
      }
    };
  });