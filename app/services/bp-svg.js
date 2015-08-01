angular
  .module('blueprint')
  .factory('bpSvg', function() {
    return {
      getAbsolutePosition: function(element, relativePosition) {
        var root = element;
        while(root.nodeName != 'svg')
          root = root.parentNode;
        var point = root.createSVGPoint();
        point.x = relativePosition[0];
        point.y = relativePosition[1];
        var matrix = element.getTransformToElement(root);        
        var result = point.matrixTransform(matrix);
        return [result.x, result.y];
      }
    };
  });

