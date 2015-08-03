angular
  .module('blueprint')
  .run(function(registry) {
    registry.addNode('neuron', {
      markupUrl: 'app/entities/neuron.template.xml',      
      state: {
        type: {
          type: ['activate', 'inhibit', 'associate', 'disassociate'],
          defaultValue: 'activate',
        }
      }
    });
  });