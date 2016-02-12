package blueprint;

class Instance
	extends Node 
	implements ConnectableSource
	implements ConnectableDestination
{
	var nodes: Array<Node>;
	
	public function new() 
	{
		
	}	
	
	function getNodeByName(name: String) : Node
	{
		return null;
	}
}