package;

class Quad
{  
  private var neurons = new Map<String, Neuron>();
  public function new(net: NeuronalNet) 
  {
    var centralNeuron = net.addNeuron(NeuronType.ACTIVATE, 1, Math.POSITIVE_INFINITY, 1);
    neurons.set(QuadConnector.CENTRAL.getName(), centralNeuron);
    for (connector in QuadConnector.createAll())
      if (connector != QuadConnector.CENTRAL)
      {
        var neuron = net.addNeuron(NeuronType.ACTIVATE, 2, Math.POSITIVE_INFINITY, 1);
        neurons.set(connector.getName(), neuron);    
        net.connect(centralNeuron, neuron);
      }
  }
  public function getNeuron(connector: QuadConnector): Neuron 
  { 
    return neurons.get(connector.getName());
  }
}