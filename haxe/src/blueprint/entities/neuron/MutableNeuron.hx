package blueprint.entities.neuron ;

class MutableNeuron extends Neuron
{
	public function new(threshold: Float, maximum: Float, factor: Float) 
	{
		super(threshold, maximum, factor);
	}
	public function setInput(value: Float) { _input = value; }
	public function setOutput(value: Float) { _output = value; }
}