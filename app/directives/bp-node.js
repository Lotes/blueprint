angular
  .module('blueprint')
  .directive('bpNode', function(registry) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpCanvas',
      scope: {
        data: '=node'
      },
      controller: function($scope) {
        this.isMouseDown = function() { return $scope.isMouseDown; };        
      },
      link: function(scope, element, attrs, parentCtrl) {
        var oldNodePosition = null;
        var oldMousePosition = null;        
        scope.isSelected = false;
        scope.isMouseDown = false;
        scope.isActive = false;
        scope.onMouseDown = function(event) {
          scope.isMouseDown = true;
          oldMousePosition = [event.clientX, event.clientY];          
          oldNodePosition = scope.data.position;
          parentCtrl.unselect();
          parentCtrl.selectNode(scope.data);          
          scope.isSelected = true;
          event.preventDefault();
        };
        scope.onMouseUp = function(event) {
          scope.isMouseDown = false;
          oldNodePosition = null;
          oldMousePosition = null;          
        };
        scope.onMouseEnter = function(event) {
          scope.isActive = true;
        };
        scope.onMouseLeave = function(event) {
          scope.isActive = false;
          scope.isMouseDown = false;
        };
        scope.$on('unselect', function() { scope.isSelected = false; });
        scope.$on('mousemove', function(event, args) {
          if(!parentCtrl.isEditing() || !scope.isSelected || oldMousePosition == null)
            return;
          args.preventDefault();
          var newMousePosition = [args.clientX, args.clientY];
          var newNodePosition = [0, 0];
          for(var index=0; index<2; index++) {
            var delta = newMousePosition[index] - oldMousePosition[index]; 
            newNodePosition[index] = oldNodePosition[index] + delta;
          }
          scope.$apply(function() {
            scope.data.position = newNodePosition;
          });          
        });
        scope.getTemplateUrl = function() {
          return registry.getNode(scope.data.templateName).markupUrl;
        }
      },
      template: '<g ng-include="getTemplateUrl()" ng-mousedown="onMouseDown($event)" ng-mouseup="onMouseUp($event)"  ng-mouseenter="onMouseEnter($event)" ng-mouseleave="onMouseLeave($event)"></g>'
    };
  });