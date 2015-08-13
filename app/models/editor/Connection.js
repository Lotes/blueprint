angular
  .module('blueprint')
  .factory('Connection', function(NgBackboneModel, Connector, AnchorCollection) {
    return NgBackboneModel.extend({
      defaults: {
        parentModule: null,
        source: null,
        destination: null,
        anchors: null
      }
    });
  })
  .factory('ConnectionCollection', function(NgBackboneCollection, Connection) {
    return NgBackboneCollection.extend({
      model: Connection  
    });  
  });