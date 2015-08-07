angular
  .module('blueprint')
  .factory('bpSvg', function() {
    return {
      mixPositions: function(a, b, part) {
        return [
          a[0] * part + b[0] * (1-part),
          a[1] * part + b[1] * (1-part)
        ];
      },
      getPositionInBoundingBox: function(element, offset) {
        var boundingBox = element.getBBox() 
        return [boundingBox.x + offset[0], boundingBox.y + offset[1]];
      },
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

