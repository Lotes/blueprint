angular
  .module('blueprint')
  .factory('Anchor', function(NgBackboneModel, Position, AnchorHandle) {
    return NgBackboneModel.extend({
      defaults: {
        parentConnection: null,
        position: new Position(),
        inHandle: new AnchorHandle(),
        outHandle: new AnchorHandle()
      }
    });
  })
  .factory('AnchorCollection', function(NgBackboneCollection, Anchor) {
    return NgBackboneCollection.extend({
      model: Anchor
    });  
  });