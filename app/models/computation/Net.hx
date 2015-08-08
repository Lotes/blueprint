package computation;
import computation.Neuron;

class Net
{
  private var neurons = new Array<computation.Neuron>();
  private var connections = new Array<Connection>();
  private var connectionsBySource = new Map<computation.Neuron, Array<Connection>>();
  private var connectionsByDestination = new Map<computation.Neuron, Array<Connection>>();
  private var learningConstant: Float;
  private var unlearningConstant: Float;
  private var decayConstant: Float;
  
  public function new(learningConstant: Float, unlearningConstant: Float, decayConstant: Float) 
  {
    this.learningConstant = learningConstant;
    this.unlearningConstant = unlearningConstant;
    this.decayConstant = decayConstant;
  }
  
  public function getLearningConstant() { return this.learningConstant; }
  public function getUnlearningConstant() { return this.unlearningConstant; }
  public function getDecayConstant() { return this.decayConstant; }

  public function addNeuron(type: NeuronType, threshold: Float, factor: Float, maximum: Float): computation.Neuron 
  {    
    var neuron = new computation.Neuron(this, type, threshold, factor, maximum); 
    neurons.push(neuron);
    return neuron;
  }
  
  public function addQuad(): computation.Quad 
  { 
    //constructor uses addNeuron- and connect-methods
    return new computation.Quad(this); 
  }
  
  public function connect(source: computation.Neuron, destination: computation.Neuron): Connection
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
  
  public function getNeurons(): Array<computation.Neuron> { return this.neurons; }
  
  public function getConnections(): Array<Connection> { return this.connections; }  
  
  public function getIncomingConnections(neuron: computation.Neuron): Array<Connection>
  {
    if (!connectionsByDestination.exists(neuron))
      return new Array<Connection>();
    return connectionsByDestination.get(neuron);
  }
  
  public function getOutgoingConnections(neuron: computation.Neuron): Array<Connection>
  {
    if (!connectionsBySource.exists(neuron))
      return new Array<Connection>();
    return connectionsBySource.get(neuron);
  }
}