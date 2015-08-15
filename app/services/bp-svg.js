angular
  .module('blueprint')
  .factory('bpSvg', function() {
    return {
      rectIntersectsRect: function(a, b) { //a,b=[x,y,w,h]
        var noIntersection =
          a[0]+a[2] < b[0]
          || a[1]+a[3] < b[1]
          || b[0]+b[2] < a[0]
          || b[1]+b[3] < a[1]
          ;
        return !noIntersection;
      },
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
      },
      getConvexHull: function(points) {
        function cross(o, a, b) {
          return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
        }
        
        points.sort(function(a, b) {
          return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
        });

        var lower = [];
        for (var i = 0; i < points.length; i++) {
          while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
          }
          lower.push(points[i]);
        }

        var upper = [];
        for (var i = points.length - 1; i >= 0; i--) {
          while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
          }
          upper.push(points[i]);
        }

        upper.pop();
        lower.pop();
        return lower.concat(upper);
      }
    };
  });

