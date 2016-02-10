package blueprint;

interface ConnectableSource 
{
	function getOutgoingConnections(): Array<Connection>;
	function connectAsSource(Connection connection);
}