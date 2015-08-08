package computation;
import computation.Net;
import computation.Neuron;

class Connection
{
  private var net: computation.Net;
  private var source: computation.Neuron;
  private var destination: computation.Neuron; 
  
  public function new(net: computation.Net, source: computation.Neuron, destination: computation.Neuron) 
  {
    this.net = net;
    this.source = source;
    this.destination = destination;
  }
  
  public function getSource(): computation.Neuron { return this.source; }
  public function getDestination(): computation.Neuron { return this.destination; }
  public function getConnectionType(): NeuronType { return this.source.getNeuronType(); }  
}