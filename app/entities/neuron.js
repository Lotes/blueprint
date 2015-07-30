angular
  .module('blueprint')
  .run(function(registry) {
    registry.addNode("neuron", {
      markupUrl: "app/entities/neuron.template.xml",      
      state: {
        type: {
          "type": ["activator", "inhibitor", "associator", "disassociator"],
          "initial": "activator",
        },
        activationLevel: function() {
          return this.incoming[0].level * this.incoming[0].weight * 100;
        }
      },
      events: {
        startDragConnection: function(connector) { /* return connection */ },
        endDragConnection: function(connector, connection) { /* return if ok/notOK */ },
        dropConnection: function(connector, connection) { /* add connection to internal list */ },
        removeConnection: function(connection) { /* remove connection from internal list */ }
      }
    });
  });