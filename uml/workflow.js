/*
  This file describes my current ideas for the top-level API (blueprint workflow).
*/

blueprint.module('Cortex', { //Serialisation+Deserialisation gibt es bei Modulen nicht! Sie sind nur Gruppengebilde!
  options: { //Eingabe-Definition
    width: blueprint.Types.PositiveInteger,
    height: blueprint.Types.PositiveInteger
  },
  builder: function($options, $this, Neuron, Cortex) { //injezierte Parameter! Builder-Skript
    this.add(new Neuron({ ... }))
  }
});

blueprint.sender('Switch', {
  options: { //serialisierbare Definition
    outputOn: {
      type: blueprint.Types.NonNegativeReal,
      'default': 1,
    },
    outputOff: {
      type: blueprint.Types.NonNegativeReal,
      'default': 0,
    }
  },
  input: { //serialisierbare Laufzeitinformationen
    enabled: {
      type: blueprint.Types.Boolean,
      'default': false,
    }
  },
  compute: function($options, $input) { //injizierte Parameter
    return $input.enabled ? $options.outputOn : $options.outputOff; 
  }
});

blueprint.sender('Slider', {
  options: {
    minimum: blueprint.Types.NonNegativeReal,
    maximum: blueprint.Types.NonNegativeReal,
  },
  input: {
    position: blueprint.Types.Percentage, //0..1
  },
  compute: function($options, $input) {
    return $options.minimum + ($options.maximum - $options.minimum) * $input.position;
  }
});

blueprint.sender('Random', {
  options: {
    minimum: blueprint.Types.NonNegativeReal,
    maximum: blueprint.Types.NonNegativeReal,
  },
  input: {},
  compute: function($options, $input) {
    return $options.minimum + ($options.maximum - $options.minimum) * Math.random();
  }
});

blueprint.receiver('Light', {
  options: {
    threshold: blueprint.Types.NonNegativeReal,
  },
  output: {
    enabled: blueprint.Types.Boolean
  },
  compute: function($output, $options, $connections) {
    var signal = 0;
    $connections.forEach(function(connection) {
      signal += connection.output;
    });
    $output.enabled = signal >= $options.threshold;
  }
});

blueprint.receiver('Gauge', {
  options: {
    minimum: blueprint.Types.NonNegativeReal,
    maximum: blueprint.Types.NonNegativeReal,
  },
  output: {
    position: blueprint.Types.Percentage,
  },
  compute: function($output, $options, $connections) {
    var signal = 0;
    $connections.forEach(function(connection) {
      signal += connection.output;
    });
    var result = (signal - $options.minimum) / ($options.maximum - $options.minimum);
    $output.position = Math.max(0, Math.min(1, result));
  }
});

blueprint.receiver('Plot', {
  options: {
    length: blueprint.Types.PositiveInteger,
  },
  output: {
    values: [blueprint.Types.NonNegativeReal],
  },
  compute: function($output, $options, $connections, $lastOutput) {
    var signal = 0;
    $connections.forEach(function(connection) {
      signal += connection.output;
    });
    var result = $lastOutput.values.concat([signal]);
    while(result.length > $options.length)
      result.shift();
    $output.values = result;
  }
});

blueprint.processor('Neuron', {
  options: {
    type: blueprint.Types.NeuronType,
    maximum: blueprint.Types.NonNegativeReal,
    threshold: blueprint.Types.NonNegativeReal,
    factor: blueprint.Types.NonNegativeReal,
  },
  input: { /* none */ },
  output: {
    activation: blueprint.Types.Percentage,
    output: blueprint.Types.NonNegativeReal,
  },
  compute: function($options, $input, $output, $connections) {
    var signal = 0;
    $connections.forEach(function(connection) {
      switch(connection.type) {
        case blueprint.Types.NeuronType.ACTIVATE:
          signal += connection.output;
          break;
        case blueprint.Types.NeuronType.INHIBIT:
          signal -= connection.output;
          break;
      }
    });
    if(signal >= $options.threshold) {
      $output.activation = 1;
      $output.output = Math.max(0, Math.min($options.maximum, (signal-$options.threshold)*$options.factor));
    } else {
      $output.activation = Math.max(0, signal/$options.threshold);
      $output.output = 0;
    }
    return $output.output;
  },
});

blueprint.connection('Connection', {
  options: {
    associatorConstant: blueprint.Types.PositiveReal,
    disassociatorConstant: blueprint.Types.PositiveReal,
    decayThreshold: blueprint.Types.NonNegatveReal,
    weight: blueprint.Types.NonNegativeReal,
  },
  input: {
    weight: blueprint.Types.NonNegativeReal,
    'default': function($options) {
      return %options.weight;
    }
  },
  output: {
    weight: blueprint.Types.NonNegativeReal
  },
  compute: function($options, $input, $output, $source, $destination) {
    $output.weight = $input.weight;
    //only change weight of activating or inhibiting neurons,
    //that are connected to associating or disassociating neurons!
    if($source.type === blueprint.Types.NeuronType.ACTIVATE
       || $source.type === blueprint.Types.NeuronType.INHIBIT
    ) {
      //compute associations gain
      var gain = 0;
      var associations = $destination.connections.filter(function(connection) {
        return connection.source.type === blueprint.Types.NeuronType.ASSOCIATE;
      });
      associations.forEach(function(association) {
        var associatonWeight = association.weight;
        var associatorOutput = association.source.output;
        var sourceOutput = $source.output;
        var destinationOutput = $destination.output;
        var L = $options.associatorConstant;
        gain += L * sourceOutput * destinationOutput * associatorOutput * associatonWeight;
      });
      
      //compute disassociations descent
      var descent = 0;
      var disassociations = $destination.connections.filter(function(connection) {
        return connection.source.type === blueprint.Types.NeuronType.DISASSOCIATE;
      }); 
      disassociations.forEach(function(disassociation) {
        var disassociationWeight = disassociation.weight;
        var disassociatorOutput = disassociation.source.output;
        var destinationOutput = $destination.output;
        var D = $options.disassociatorConstant;
        descent += D * destinationOutput * disassociatorOutput * disassociationWeight;
      });

      //compute new weight
      var sum = gain - descent;
      if(sum === 0) {
        if($input.weight < $options.decayThreshold) //forget
          $output.weight = Math.sqrt(Math.max(0, Math.pow($input.weight, 2) - $options.decayThreshold)); else //keep          
      } else if(sum > 0) { //associate
        $output.weight = Math.pow(Math.sqrt($input.weight) + sum, 2);
      } else { //sum < 0: disassociate
        $output.weight = Math.sqrt(Math.max(0, Math.pow($input.weight, 2) + sum));
      }
    }
    return $input.weight * $source.output;
  }
});

/*
Provider:
-$input (processor, sender, connection)
-$output (processor, receiver, connection)
-$options (processor, sender, receiver, connection)
-$connections (processor, receiver)
-$lastOutput (processor, receiver, connection)
-$lastInput (processor, sender, connection)
-$source, $destination (connection)
-Options und Inputs haben Default-Werte
*/