angular
  .module('blueprint')
  .filter('pathify', function() {
    return function(points) {
      return 'M'+_.map(points, function(point) {
        return point[0]+','+point[1];  
      }).join(' L')+' Z';
    };
  })