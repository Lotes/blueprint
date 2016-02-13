package blueprint.entities ;

interface ConnectableDestination 
{
	function getIngoingConnections(): Array<Connection>;
	function connectAsDestination(connection: Connection); 
}