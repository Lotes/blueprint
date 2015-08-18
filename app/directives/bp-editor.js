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
        $scope.rootInstance = new ModuleInstance(null, $scope.data);
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
        //mouse events
        var events = ['mousedown', 'mousemove', 'mouseup'];
        _.each(events, function(eventName) {
          $element.bind(eventName, function(event) {
            self.trigger($scope.mode+':'+eventName, event);
          });  
        });
        function getEventPosition(event) {
          return bpSvg.getAbsolutePosition(event.target, [event.offsetX, event.offsetY]);
        }
        //selection
        var selectionStart = [0, 0];
        $scope.showSelectionRectangle = false;
        $scope.selectionRectangle = [0, 0, 0, 0]; //x, y, w, h
        self.on('select:mousedown', function(event) { 
          event.preventDefault();
          if(!angular.element(event.target).hasClass('grid'))
            return;
          selectionStart = getEventPosition(event);
          $scope.selectionRectangle = [selectionStart[0], selectionStart[1], 0, 0];
          $scope.showSelectionRectangle = true;
          $scope.$apply();
        });
        self.on('select:mousemove', function(event) { 
          if(!$scope.showSelectionRectangle)
            return;
          event.preventDefault();
          var currentPosition = getEventPosition(event);
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
          if(!event.shiftKey && !event.metaKey)
            self.trigger('unselect');
          event.preventDefault();
          self.trigger('selectRectangle', $scope.selectionRectangle);
          $scope.showSelectionRectangle = false; 
          $scope.$apply();
        });
        Mousetrap.bind('del', function() { 
          if($scope.mode !== 'select')
            return;
          self.trigger('deleteSelection');
        }, 'keydown');
        //center
        var movePressed = false;
        var moveOldCenter = [0, 0];
        var moveStart = [0, 0];
        $scope.center = [0, 0];
        self.on('move:mousedown', function(event) { 
          event.preventDefault();
          movePressed = true;
          moveStart = getEventPosition(event);
          moveOldCenter = $scope.center;
        });
        self.on('move:mousemove', function(event) { 
          event.preventDefault();
          if(!movePressed)
            return;
          var currentPosition = getEventPosition(event);
          $scope.center = [
            moveOldCenter[0] + currentPosition[0] - moveStart[0],
            moveOldCenter[1] + currentPosition[1] - moveStart[1]
          ];
          $scope.$apply();
        });
        self.on('move:mouseup', function(event) { 
          event.preventDefault();
          movePressed = false;
        });
      }
    };
  });