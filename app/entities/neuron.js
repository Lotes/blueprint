registerNode("neuron", {
  markupUrl: "app/entities/neuron.template.xml",
  connectors: [{
    name: "default",
    position: [0, 0],
    radius: 13
  }],
  variables: {
    type: {
      "type": ["activator", "inhibitor", "associator", "disassociator"],
      "initial": "activator",
    },
    activationLevel: function() {
      return this.incoming[0].level * this.incoming[0].weight * 100f;
    }
    //...
  }
});