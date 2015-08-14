angular
  .module('blueprint')
  .factory('Module', function(NgBackboneModel) {
    return NgBackboneModel.extend({
      defaults: {
        name: null,
        description: null,
        nodes: null,
        connections: null
      }
      //add/remove connections
      //add/remove nodes
    });
  })
  .factory('ModuleCollection', function(NgBackboneCollection, Module) {
    return NgBackboneCollection.extend({
      model: Module
    }) 
  });