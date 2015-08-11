angular
  .module('blueprint')
  .factory('Anchor', function(NgBackboneModel, Position) {
    return NgBackboneModel.extend({
      defaults: {
        parentConnection: null,
        position: new Position(),
        inHandle: new Position(),
        outHandle: new Position()
      }
    });
  })
  .factory('AnchorCollection', function(NgBackboneCollection, Anchor) {
    return NgBackboneCollection.extend({
      model: Anchor
    });  
  });