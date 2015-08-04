package;

class Connection
{
  private var net: Net;
  private var source: Neuron;
  private var destination: Neuron; 
  
  public function new(net: Net, source: Neuron, destination: Neuron) 
  {
    this.net = net;
    this.source = source;
    this.destination = destination;
  }
  
  public function getSource(): Neuron { return this.source; }
  public function getDestination(): Neuron { return this.destination; }
  public function getConnectionType(): NeuronType { return this.source.getNeuronType(); }
}