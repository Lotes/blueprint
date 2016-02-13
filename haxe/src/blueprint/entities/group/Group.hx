package blueprint.entities.group ;

class Group
	extends Node,
	implements ConnectableSource,
	implements ConnectableDestination
{
	var nodes: Array<Node>;
	
	public function new() 
	{
		
	}	
}