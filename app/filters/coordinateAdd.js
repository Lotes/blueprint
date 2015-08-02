angular
  .module('blueprint')
  .filter('coordinateAdd', function() {
    return function(position, relative) {    
      return [
        position[0] + relative[0],
        position[1] + relative[1]
      ];;
    };
  })