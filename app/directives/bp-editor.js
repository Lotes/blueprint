angular
  .module('blueprint')
  .directive('bpEditor', function($window, Position, ModuleInstance, bpSvg, AnchorHandle) {
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
        //object registration
        var selectables = [];
        self.registerSelectable = function(obj) { selectables.push(obj); };
        self.unregisterSelectable = function(obj) { selectables = _.without(selectables, obj); };
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
        $scope.selection = [];
        var selectionStart = [0, 0];
        $scope.showSelectionRectangle = false;
        $scope.selectionRectangle = [0, 0, 0, 0]; //x, y, w, h
        self.unselect = function() {
          _.each(selectables, function(selectable) { selectable.select(false); });
          $scope.selection = [];
        };
        self.selectObject = function(selectable, append) {
          if(!append) self.unselect();
          selectable.select(true);
          $scope.selection.push(selectable);
        };
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
          if(!$scope.showSelectionRectangle || $scope.selectionRectangle[2] == 0 || $scope.selectionRectangle[3] == 0)
            return;
          event.preventDefault();
          $scope.showSelectionRectangle = false;
          if(!event.shiftKey && !event.metaKey)
            self.unselect();
          _.each(selectables, function(selectable) {
            if(selectable.canSelect($scope.selectionRectangle)) {
              selectable.select(true);
              $scope.selection.push(selectable);
            }
          });
          $scope.$apply();
        });
        Mousetrap.bind('del', function() { 
          if($scope.mode !== 'select')
            return;
          _.each($scope.selection, function(selectable) {
            selectable.remove();
          });
        }, 'keydown');
        //dragging
        var isDragging = false;
        var dragStartPosition = [0, 0];
        var draggables = [];
        self.isDragging = function() { return isDragging; };
        self.startDragging = function(event) {
          isDragging = true;
          dragStartPosition = getEventPosition(event);
          var selectedItems = selectables.filter(function(selectable) { 
            if(selectable.isSelected())
              return selectable.isDraggable(); 
          });
          draggables = selectedItems.length <= 1 ? selectedItems : selectedItems.filter(function(selectable) {
            return !(selectable.getEntity() instanceof AnchorHandle);
          });
          _.each(draggables, function(draggable) { draggable.startDragging(); });
        };
        self.stopDragging = function() { 
          isDragging = false;
          _.each(draggables, function(draggable) { draggable.stopDragging(); }); 
          draggables = [];
        };
        self.drag = function(delta) {
          _.each(draggables, function(draggable) { draggable.drag(delta); });  
        };
        self.on('select:mouseup', function(event) { 
          if(isDragging)
            self.stopDragging();
        });
        self.on('select:mousemove', function(event) {
          if(!isDragging)
            return;
          var dragEndPosition = getEventPosition(event);
          self.drag([
            dragEndPosition[0] - dragStartPosition[0],
            dragEndPosition[1] - dragStartPosition[1]
          ]);
          $scope.$apply();
        });
        //move scene
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