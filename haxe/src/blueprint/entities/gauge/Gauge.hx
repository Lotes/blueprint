package blueprint.entities.gauge ;

class Gauge
	extends Node,
	implements ConnectableDestination
{
	var threshold: Float;
	var maximum: Float;
	
	//state
	//-input: Float
	//-activation: Percentage
	//-position: 0..1
	
	public function new() 
	{
		
	}	
}