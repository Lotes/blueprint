angular
  .module('blueprint')
  .filter('coordinate', function(Position) {
    return function(position) {    
      if(position instanceof Position)
        return position.coordinates[0]+","+position.coordinates[1];
      return position[0]+","+position[1];
    };
  })