package blueprint.entities ;

import blueprint.entities.connection.*;

interface ConnectableDestination 
{
	function getIngoingConnections(): Array<Connection>;
	function connectAsDestination(connection: Connection): Void; 
}