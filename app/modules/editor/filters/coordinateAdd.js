angular
  .module('blueprint')
  .filter('coordinateAdd', function(Position) {
    return function(position, relative) { 
      if(position instanceof Position)
        return [
          position.coordinates[0]+relative.coordinates[0],
          position.coordinates[1]+relative.coordinates[1]
        ];
      return [
        position[0] + relative[0],
        position[1] + relative[1]
      ];;
    };
  })