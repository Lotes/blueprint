package blueprint.entities ;

interface ConnectableSource 
{
	function getOutgoingConnections(): Array<Connection>;
	function connectAsSource(connection: Connection);
}