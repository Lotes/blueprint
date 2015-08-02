angular
  .module('blueprint')
  .filter('coordinate', function() {
    return function(position) {    
      return position[0]+","+position[1];
    };
  })