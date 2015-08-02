angular
  .module('blueprint')
  .run(function(registry) {
    registry.addNode('neuron', {
      markupUrl: 'app/entities/neuron.template.xml',      
      state: {
        type: {
          type: ['activate', 'inhibit', 'associate', 'disassociate'],
          initialValue: 'activate',
        }
      },
      events: {        
        canStartConnection: function(connector, connection) { /* return if ok/notOK */ },
        canConnect: function(connector, connection) { /* return if ok/notOK */ },
        //connect: function(connector, connection) { /* add connection to internal list */ },
        //startConnection: function(connector) { /* return connection */ },
        //removeConnection: function(connection) { /* remove connection from internal list */ }
      }
    });
  });