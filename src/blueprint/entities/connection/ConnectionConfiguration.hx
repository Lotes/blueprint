package blueprint.entities.connection;

interface ConnectionConfiguration 
{
	function getConnectionType(): ConnectionType;
	function getSource(): ConnectableSource;
	function getDestination(): ConnectableDestination;
	function getDecayingConstant(): Float;
	function getAssociatingConstant(): Float;
	function getDisassociatingConstant(): Float;
	function getWeight(): Float; 
}