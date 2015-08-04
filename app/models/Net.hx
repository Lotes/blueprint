package;

class Net
{
  private var neurons = new Array<Neuron>();
  private var connections = new Array<Connection>();
  private var connectionsBySource = new Map<Neuron, Array<Connection>>();
  private var connectionsByDestination = new Map<Neuron, Array<Connection>>();
  
  public function new() {}

  public function addNeuron(type: NeuronType, threshold: Float, factor: Float, maximum: Float): Neuron 
  {    
    var neuron = new Neuron(this, type, threshold, factor, maximum); 
    neurons.push(neuron);
    return neuron;
  }
  
  public function addQuad(): Quad 
  { 
    //constructor uses addNeuron- and connect-methods
    return new Quad(this); 
  }
  
  public function connect(source: Neuron, destination: Neuron): Connection
  {
    var connection = new Connection(this, source, destination);
    connections.push(connection);
    if (!connectionsBySource.exists(source))
      connectionsBySource.set(source, new Array<Connection>());
    if (!connectionsByDestination.exists(destination))
      connectionsByDestination.set(destination, new Array<Connection>());
    connectionsBySource.get(source).push(connection);
    connectionsByDestination.get(destination).push(connection);
    return connection;
  }
  
  public function getNeurons(): Array<Neuron> { return this.neurons; }
  
  public function getConnections(): Array<Connection> { return this.connections; }  
  
  public function getIncomingConnections(neuron: Neuron): Array<Connection>
  {
    if (!connectionsByDestination.exists(neuron))
      return new Array<Connection>();
    return connectionsByDestination.get(neuron);
  }
  
  public function getOutgoingConnections(neuron: Neuron): Array<Connection>
  {
    if (!connectionsBySource.exists(neuron))
      return new Array<Connection>();
    return connectionsBySource.get(neuron);
  }
}