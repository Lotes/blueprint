angular
  .module('blueprint')
  .factory('Position', function(NgBackboneModel) {
    return NgBackboneModel.extend({
      defaults: {
        x: 0,
        y: 0
      }
    });
  });