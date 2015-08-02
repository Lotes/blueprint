angular
  .module('blueprint')
  .run(function(registry) {
    registry.addNode('quad', {
      markupUrl: 'app/entities/quad.template.xml',      
    });
  });