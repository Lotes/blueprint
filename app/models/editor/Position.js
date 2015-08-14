angular
  .module('blueprint')
  .factory('Position', function(NgBackboneModel) {
    return NgBackboneModel.extend({
      defaults: {
        x: 0,
        y: 0
      },
      fromArray: function(array) {
        this.set({ 
          x: array[0],  
          y: array[1]  
        });  
      },
      toArray: function() {
        return [
          this.get('x'),
          this.get('y')
        ];  
      }
    });
  });