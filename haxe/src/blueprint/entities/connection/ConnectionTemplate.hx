package blueprint.entities.connection;

class ConnectionTemplate
	implements ConnectionConfiguration
	implements ConnectionConfigurator<ConnectionTemplate>
{
	/* VARIABLES */
	private var _type: ConnectionType = ConnectionType.ACTIVATE;
	private var _source: ConnectableSource = null;
	private var _destination: ConnectableDestination = null;
	private var _decayingConstant: Float = 0;
	private var _associatingConstant: Float = 0;
	private var _disassociatingConstant: Float = 0;
	private var _weight: Float = 1;
	
	/* INTERFACE blueprint.entities.connection.ConnectionConfiguration */
	public function getConnectionType():ConnectionType { return this._type; }
	public function getSource():ConnectableSource { return this._source; }
	public function getDestination():ConnectableDestination { return this._destination; }
	public function getDecayingConstant():Float { return this._decayingConstant; }
	public function getAssociatingConstant():Float { return this._associatingConstant; }
	public function getDisassociatingConstant():Float { return this._disassociatingConstant; }
	public function getWeight():Float { return this._weight; }
	
	/* INTERFACE ConnectionConfigurator<ConnectionTemplate> */
	public function type(value:ConnectionType):ConnectionTemplate { this._type = value; return this; }
	public function source(value:ConnectableSource):ConnectionTemplate { this._source = value; return this; }
	public function destination(value:ConnectableDestination):ConnectionTemplate { this._destination = value; return this; }
	public function decaying(value:Float):ConnectionTemplate { this._decayingConstant = value; return this; }
	public function associating(value:Float):ConnectionTemplate { this._associatingConstant = value; return this; }
	public function disassociating(value:Float):ConnectionTemplate { this._disassociatingConstant = value; return this; }
	public function weight(value:Float):ConnectionTemplate { this._weight = value; return this; }
}