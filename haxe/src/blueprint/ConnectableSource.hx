package blueprint;

interface ConnectableSource 
{
	function getOutgoingConnections(): Array<Connection>;
	function connectAsSource(connection: Connection);
}