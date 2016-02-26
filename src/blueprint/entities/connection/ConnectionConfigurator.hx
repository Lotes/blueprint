package blueprint.entities.connection;

interface ConnectionConfigurator<T>
{
	function type(value: ConnectionType): T;
	function source(value: ConnectableSource): T;
	function destination(value: ConnectableDestination): T;
	function decaying(value: Float): T;
	function associating(value: Float): T;
	function disassociating(value: Float): T;
	function weight(value: Float): T;  
}