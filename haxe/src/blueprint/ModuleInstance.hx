package blueprint;

class ModuleInstance
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