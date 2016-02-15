package blueprint.entities ;

import blueprint.entities.connection.*;

interface ConnectableSource 
{
	function getOutgoingConnections(): Array<Connection>;
	function connectAsSource(connection: Connection): Void;
}