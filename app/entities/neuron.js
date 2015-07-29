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
        startConnection: function() {},
        endConnection: function() {},
      }
    });
  });