angular
  .module('blueprint')
  .factory('Connection', function(NgBackboneModel, Connector, AnchorCollection) {
    return NgBackboneModel.extend({
      defaults: {
        parentModule: null, //Module
        source: null, //ConnectionEndPoint
        destination: null, //ConnectionEndPoint
        anchors: null //AnchorCollection
      }
    });
  })
  .factory('ConnectionCollection', function(NgBackboneCollection, Connection) {
    return NgBackboneCollection.extend({
      model: Connection  
    });  
  });