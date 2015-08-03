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
                return [0, 0]; //TODO
              };
          }
          connectors[name] = {
            $element: $element,            
            connectAt: connectAt,
            events: {
              mousedown: function(event) { 
                console.log($scope.data.label+'->'+name+" mousedown");
              },
              mouseup: function(event) { 
                console.log($scope.data.label+'->'+name+" mouseup");
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
        //finalization
        $scope.$on('$destroy', function() { parentCtrl.removeNode($scope.id); })        
        //template
        $scope.getTemplateUrl = function() {
          return registry.getNode($scope.data.templateName).markupUrl;
        };     
      },
      template: '<g ng-include="getTemplateUrl()" bp-selectable="data" selection-type="node"></g>'
    };
  });