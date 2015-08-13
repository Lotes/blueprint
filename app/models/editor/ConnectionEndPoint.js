angular
  .module('blueprint')
  .factory('ConnectionEndPoint', function(NgBackboneModel) {
    return NgBackboneModel.extend({
      defaults: {
        path: null, //list of node names
        connector: null //name of connector
      }
    });
  });