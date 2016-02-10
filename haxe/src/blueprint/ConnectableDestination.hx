package blueprint;

interface ConnectableDestination 
{
	function getIngoingConnections(): Array<Connection>;
	function connectAsDestination(Connection connection); 
}