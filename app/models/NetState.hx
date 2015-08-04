package;

class NetState
{
  private var net: Net;
  private var neuronStates = new Map<Neuron, NeuronState>();
  private var connectionStates = new Map<Connection, ConnectionState>();
  public function new(net: Net) 
  {
    this.net = net;
  }
  public function initialize()
  {
    for (neuron in net.getNeurons())
      neuronStates.set(neuron, new NeuronState(0));
    for (connection in net.getConnections())
      connectionStates.set(connection, new ConnectionState(0));
  }
  public function getNeuronState(neuron: Neuron): NeuronState
  {
    return neuronStates.get(neuron);  
  }
  public function getConnectionState(connection: Connection): ConnectionState
  {
    return connectionStates.get(connection);  
  }
  public function setNeuronState(neuron: Neuron, potential: Float): Void
  {
    neuronStates.set(neuron, new NeuronState(potential));  
  }
  public function setConnectionState(connection: Connection, weight: Float): Void
  {
    connectionStates.set(connection, new ConnectionState(weight));  
  }
  public function nextState(): NeuronState 
  {
    var newState = new NetState();
    //update neurons
    for (neuron in net.getNeurons())
    {
      //A := sum(ai*gi) 
      var potential = 0.0;
      for (connection in neuron.getIncomingConnections())
      {
        var sign = connection.getConnectionType() == NeuronType.INHIBIT ? -1 : 1;
        var input = getNeuronState(connection.getSource()).getPotential();
        var weight = getConnectionState(connection).getWeight();        
        potential += sign * weight * input;
      }  
      //if A > threshold then
      var threshold = neuron.getThreshold();
      if (potential > threshold) {
        //A := min(maximum, (A-threshold) * factor)
        var maximum = neuron.getMaximum();
        var factor = neuron.getFactor();
        potential = Math.min(maximum, (potential-threshold) * factor);
      } else 
        //A := 0
        potential = 0;
      newState.setNeuronState(neuron, potential);
    }    
    //update connections
    /*
     * berechne_assozierend:
     *  if av > 0 then
     *    gi := (sqrt(gi)+ai*av*gv*A*L)^2
     *  else
     *    if gi < T the
     *      gi := sqrt(gi^2-K)
     * 
     * berechne_disassozierend:
     *  if ad > 0 then
     *    gi := sqrt(gi^2-ad*D*gd*A)
     *  else
     *    if gi < T the
     *      gi := sqrt(gi^2-K)
     */
    return newState;  
  }
}