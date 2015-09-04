package  ;

class Neuron
{
  private var net: Net;
  private var type: NeuronType;
  private var threshold: Float;
  private var factor: Float;
  private var maximum: Float;  
  /**
   * <code>
   *  COMPUTE_NEURON_POTENTIAL:
   *    A := sum(ai*gi) 
   *    if A > threshold then
   *      A := min(maximum, (A-threshold) * factor)
   *    else
   *      A := 0
   * </code>
   * @param net the neuronal net this neuron belongs to
   * @param type has influence on the computation of potentials and connection weights
   * @param threshold if input is greater or equal threshold, neuron becomes active (>=0)
   * @param factor will be multiplied with the outgoing potential (>=0)
   * @param maximum limits the outgoing potential (>=0)
   */
	public function new(net: Net, 
    type: NeuronType, threshold: Float, factor: Float, maximum: Float) 
	{
		this.net = net;
    this.type = type;
    this.threshold = threshold;
    this.factor = factor;
    this.maximum = maximum;
	}

	public function getNet(): Net { return this.net; }
  public function getNeuronType(): NeuronType { return this.type; }
  public function getThreshold(): Float { return this.threshold; }
  public function getFactor(): Float { return this.factor; }
  public function getMaximum(): Float { return this.maximum; }
  public function getIncomingConnections(): Array<Connection>
  {
    return this.net.getIncomingConnections(this);
  }  
  public function getOutgoingConnections(): Array<Connection>
  {
    return this.net.getOutgoingConnections(this);
  }
}