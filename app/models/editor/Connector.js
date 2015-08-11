angular
  .module('blueprint')
  .factory('Connector', function(NgBackboneModel) {
    return NgBackboneModel.extend({
      defaults: {
        node: null
        //use id as name
      }
    });
  })
  .factory('ConnectorCollection', function(NgBackboneCollection, Connector) {
    return NgBackboneCollection.extend({
      model: Connector
    });  
  });