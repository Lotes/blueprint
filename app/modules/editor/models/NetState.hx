package  ;
import Neuron;
import NeuronState;

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
  public function nextState(): NetState 
  {
    var newState = new NetState(net);
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
    /* PROBLEM associators/disassociators:
     * -which one first?
     * --> chosen associators before disassociators
     */
    for (connection in net.getConnections()) 
    {
      var connectionState = this.getConnectionState(connection);
      var weight = connectionState.getWeight();
      var newWeight: Float = weight;
      var connectionType = connection.getConnectionType();
      if (connectionType == NeuronType.ACTIVATE || connectionType == NeuronType.INHIBIT)
      {
        var source = connection.getSource();
        var sourceState = this.getNeuronState(source);
        var sourcePotential = sourceState.getPotential();
        var destination = connection.getDestination();
        var destinationState = newState.getNeuronState(destination); //ATTENTION! It's the next state of the neuron!!!
        var destinationPotential = destinationState.getPotential();
        //get associators and disassociators
        var associations = new Array<Connection>();
        var disassociations = new Array<Connection>();
        for (neighbourConnection in net.getIncomingConnections(destination))
          switch(neighbourConnection.getConnectionType()) {
            case NeuronType.ASSOCIATE: associations.push(neighbourConnection);
            case NeuronType.DISASSOCIATE: disassociations.push(neighbourConnection);
            default:
          }
        //associate
        var gain = 0.0;
        for (association in associations)
        {
          //gain_i = ai*av*gv*aj*L
          //-> ai = source potential
          //-> aj = destination potential
          //-> av = associator potential
          //-> gv = weight of connection (associator->destination)          
          //-> L = learning constant
          var associator = association.getSource();
          var av = this.getNeuronState(associator).getPotential();
          if (av > 0)
          {
            var ai = sourcePotential;
            var aj = destinationPotential;
            var gv = this.getConnectionState(association).getWeight();
            var L = net.getLearningConstant();
            gain += ai * aj * av * gv * L;
          }
        }
        if (gain > 0)
          newWeight = Math.pow(Math.sqrt(weight) + gain, 2);
        //disassociate
        var descent = 0.0;
        for (disassociation in disassociations)
        {
          //descent_i = ad*gd*aj*D
          //ad = disassociator potential
          //gd = weight of connector (disassociator->destination)
          //aj = destination potential
          var disassociator = disassociation.getSource();
          var ad = this.getNeuronState(disassociator).getPotential();
          if (ad > 0)
          {
            var aj = destinationPotential;
            var gd = this.getConnectionState(disassociation).getWeight();
            var D = net.getUnlearningConstant();
            descent += ad * gd * aj * D;
          }
        }
        if (descent > 0)
          newWeight = Math.sqrt(Math.pow(weight, 2) - descent);
        //forget
        var T = net.getDecayConstant();
        if (gain == 0 && descent == 0 && weight < T)
          newWeight = Math.sqrt(Math.pow(weight, 2) - T);          
      }      
      newState.setConnectionState(connection, newWeight);
    }
    return newState;  
  }  
}