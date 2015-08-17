angular
  .module('blueprint')
  .factory('AnchorHandle', function(NgBackboneModel, Position) {
    return NgBackboneModel.extend({
      defaults: {
        position: new Position()
      },
      toArray: function() { return this.get('position').toArray(); }
    });
  });