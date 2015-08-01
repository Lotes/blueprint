angular
  .module('blueprint')
  .directive('bpNode', function(registry, bpEditor, bpSvg) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: ['bpNode', '^bpCanvas'], //HACK to access current controller during linkage
      scope: {
        id: '=nodeId',
        data: '=node'
      },
      controller: function($scope) { 
        var connectors = {};
        $scope.$on('editorModeChange', function() {
          var bind = bpEditor.mode === 'connect' ? 'bind' : 'unbind';
          for(var connectorName in connectors) {
            var connector = connectors[connectorName];
            for(var property in connector.events)
              connector.$element[bind](property, connector.events[property]);
          }  
        });
        this.addConnector = function(name, $element) { 
          var element = $element[0];
          var connectAt;          
          switch(element.nodeName) {
            case 'circle':
              connectAt = function(anchorPosition) {
                var relativePosition = [element.cx.baseVal.value, element.cy.baseVal.value];
                var radius = element.r.baseVal.value + 2;                
                var absolutePosition = bpSvg.getAbsolutePosition(element, relativePosition);
                var dx = absolutePosition[0] - anchorPosition[0];
                var dy = absolutePosition[1] - anchorPosition[1];
                var distance = Math.sqrt(dx*dx + dy*dy);
                var part = radius / distance;
                return [
                  absolutePosition[0] * (1-part) + anchorPosition[0] * part,
                  absolutePosition[1] * (1-part) + anchorPosition[1] * part
                ];
              };
              break;
            default:
              connectAt = function(anchorPosition) {
                return null;
              };
          }
          connectors[name] = {
            $element: $element,            
            connectAt: connectAt,
            events: {
              mousedown: function(event) { 
                console.log($scope.data.label+'->'+name+" mousedown");
              },
              mouseenter: function(event) { 
                console.log($scope.data.label+'->'+name+" mouseenter");
              },
              mouseleave: function(event) { 
                console.log($scope.data.label+'->'+name+" mouseleave");
              } 
            }
          };
        };    
        this.getConnector = function(name) {
          return connectors[name];
        };
      },
      link: function($scope, element, attrs, controllers) {
        var controller = controllers[0];
        var parentCtrl = controllers[1];
        //registration
        parentCtrl.addNode($scope.id, controller);
        $scope.$on('$destroy', function() { parentCtrl.removeNode($scope.id); })
        //selection/drag/drop
        var oldNodePosition = null;
        var oldMousePosition = null;        
        $scope.isSelected = false;
        $scope.isMouseDown = false;
        $scope.isActive = false;
        $scope.onMouseDown = function(event) {
          $scope.isMouseDown = true;
          oldMousePosition = [event.clientX, event.clientY];          
          oldNodePosition = $scope.data.position;          
          event.preventDefault();
        };
        $scope.onMouseUp = function(event) {
          $scope.isMouseDown = false;
          oldNodePosition = null;
          oldMousePosition = null;          
          bpEditor.unselect();
          bpEditor.selectNode($scope.data);          
          $scope.isSelected = true;
          event.preventDefault();
        };
        $scope.onMouseEnter = function(event) {
          $scope.isActive = true;
        };
        $scope.onMouseLeave = function(event) {
          $scope.isActive = false;
          $scope.isMouseDown = false;
        };
        $scope.$on('unselect', function() { $scope.isSelected = false; });
        $scope.$on('mousemove', function(event, args) {
          if(bpEditor.mode != 'select' || !$scope.isSelected || oldMousePosition == null)
            return;
          args.preventDefault();
          var newMousePosition = [args.clientX, args.clientY];
          var newNodePosition = [0, 0];
          for(var index=0; index<2; index++) {
            var delta = newMousePosition[index] - oldMousePosition[index]; 
            newNodePosition[index] = oldNodePosition[index] + delta;
          }
          $scope.$apply(function() {
            $scope.data.position = bpEditor.snapPosition(newNodePosition);
          });          
        });
        $scope.getTemplateUrl = function() {
          return registry.getNode($scope.data.templateName).markupUrl;
        };        
      },
      template: '<g ng-include="getTemplateUrl()" ng-mousedown="onMouseDown($event)" ng-mouseup="onMouseUp($event)"  ng-mouseenter="onMouseEnter($event)" ng-mouseleave="onMouseLeave($event)"></g>'
    };
  });