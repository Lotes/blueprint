angular
  .module('blueprint')
  .factory('Connection', function(NgBackboneModel, Connector, AnchorCollection) {
    return NgBackboneModel.extend({
      defaults: {
        parentModule: null,
        source: new Connector(),
        destination: new Connector(),
        anchors: new AnchorCollection()
      }
    });
  })
  .factory('ConnectionCollection', function(NgBackboneCollection, Connection) {
    return NgBackboneCollection.extend({
      model: Connection  
    });  
  });