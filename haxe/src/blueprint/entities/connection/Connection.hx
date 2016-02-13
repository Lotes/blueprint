package blueprint.entities.connection ;

class Connection 
	extends Entity
	implements ConnectableDestination
{
	var source: ConnectableSource;
	var destination: ConnectableDestination;
	var type: ConnectionType;
	var decayConstant: Float; //default = 0
	var associateConstant: Float; //optional, default = 0
	
	//state
	var weight: Float;
	var input: Float;
	var output: Float;
	
	public function new() 
	{
		
	}
}