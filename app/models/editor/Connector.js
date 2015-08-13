angular
  .module('blueprint')
  .factory('Connector', function(NgBackboneModel) {
    return NgBackboneModel.extend({
      idAttribute: 'name',
      defaults: {
        parentNode: null
      }
    });
  })
  .factory('ConnectorCollection', function(NgBackboneCollection, Connector) {
    return NgBackboneCollection.extend({
      model: Connector
    });  
  });