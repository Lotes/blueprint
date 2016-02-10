package blueprint;

class Neuron 
	extends Node,
	implements ConnectableDestination,
	implements ConnectableSource
{
	var threshold: Float;
	var maximum: Float;
	var factor: Float;
	
	//state
	//-input: Float
	//-output: Float
	//-activation: Percentage
	
	public function new() 
	{
		
	}	
}