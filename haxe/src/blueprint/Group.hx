package blueprint;

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