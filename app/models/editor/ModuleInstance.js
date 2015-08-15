angular
  .module('blueprint')
  .factory('ModuleInstance', function(Node, bpSvg) {
    return Node.extend({
      defaults: _.extend({}, Node.prototype.defaults, {
        module: null,
        //connectors, name, parentModule, position
        className: 'ModuleInstance',
        module: null
      }),
      initialize: function() {
        Node.prototype.initialize.call(this, arguments);
      },
      getConvexHull: function() {
        var points = [];
        //merge node hulls
        _.each(this.get('module').get('nodes').$models, function(node) {
          var hull = node.getConvexHull();
          var relativePosition = node.get('position').toArray();
          var relativeHull = _.map(hull, function(point) {
            return [
              relativePosition[0] + point[0],
              relativePosition[1] + point[1]
            ];  
          });
          points = points.concat(relativeHull);
        });
        //merge connection hulls
        //TODO
        //create convex hull        
        if(points.length <= 3)
          return points;
        return bpSvg.getConvexHull(points);
      }
    });
  });