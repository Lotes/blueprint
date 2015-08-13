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
    });
  })
  .factory('ModuleCollection', function(NgBackboneCollection, Module) {
    return NgBackboneCollection.extend({
      model: Module
    }) 
  });