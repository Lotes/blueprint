angular
  .module('blueprint')
  .directive('bpEditor', function($window, Position, ModuleInstance, bpSvg, AnchorHandle, Connection, ConnectionEndPoint, Anchor) {
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
          return bpSvg.getMousePosition($element[0], [event.clientX, event.clientY]);
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
          if(!$scope.showSelectionRectangle)
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
            if(selectable.getEntity().getModule() == $scope.data)
              selectable.remove();
          });
          $scope.$apply();
        }, 'keydown');
        //dragging
        var isDragging = false;
        var dragObjectPosition = [0, 0];
        var dragStartPosition = [0, 0];
        var draggables = [];
        self.isDragging = function() { return isDragging; };
        self.startDragging = function(position, event) {
          isDragging = true;
          dragObjectPosition = position == null ? null : position.toArray();
          dragStartPosition = getEventPosition(event);
          var selectedItems = selectables.filter(function(selectable) { 
            var entity = selectable.getEntity();
            if(selectable.isSelected() && entity.getModule() == $scope.data)
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
          var delta = [
            dragEndPosition[0] - dragStartPosition[0],
            dragEndPosition[1] - dragStartPosition[1]
          ];
          if(dragObjectPosition) {
            var dragObjectNewPosition = self.snapPosition([
              dragObjectPosition[0] + delta[0],
              dragObjectPosition[1] + delta[1]
            ]);
            self.drag([
              dragObjectNewPosition[0] - dragObjectPosition[0],
              dragObjectNewPosition[1] - dragObjectPosition[1]
            ]);
          } else
            self.drag(delta);
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
        //connect nodes
        var connectingSource = null;
        $scope.isConnecting = false;
        self.startConnecting = function(sourceConnector) {
          $scope.isConnecting = true;
          connectingSource = sourceConnector;
          $scope.$apply();
        };
        self.endConnecting = function(destinationConnector) {
          if(!$scope.isConnecting)
            return;
          $scope.isConnecting = false;          
          var source = new ConnectionEndPoint(connectingSource.getNode().getPath(), connectingSource.getName());
          var destination = new ConnectionEndPoint(destinationConnector.getNode().getPath(), destinationConnector.getName());
          var newConnection = new Connection(source, destination);
          newConnection.parentModule = $scope.data;
          if(connectingSource === destinationConnector) {
            var center = connectingSource.getCenter($element.find('g')[0]); //TODO ugly solution
            var anchor1 = new Anchor(center[0]+50, center[1]-100);
            anchor1.parentConnection = newConnection;
            anchor1.inHandle = new AnchorHandle(anchor1, -50, 0);
            anchor1.outHandle = new AnchorHandle(anchor1, +25, 0);
            newConnection.anchors.push(anchor1);
            var anchor2 = new Anchor(center[0]+100, center[1]-50);
            anchor2.parentConnection = newConnection;
            anchor2.inHandle = new AnchorHandle(anchor2, 0, -25);
            anchor2.outHandle = new AnchorHandle(anchor2, 0, +50);
            newConnection.anchors.push(anchor2);
          }
          $scope.data.connections.push(newConnection);
          $scope.$apply();
        };
        self.abortConnecting = function() {
          if(!$scope.isConnecting)
            return;
          $scope.isConnecting = false;
          $scope.$apply();
        };
        self.on('connect:mousemove', function(event) {
          if(!$scope.isConnecting)
            return;
          $scope.$apply();
        });
        self.on('connect:mouseup', function(event) {
          self.abortConnecting();
        });
      }
    };
  });