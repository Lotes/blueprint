package blueprint.entities.connection ;

class Connection 
	extends Entity
	implements ConnectableDestination
	implements ConnectionConfiguration 
{
	private var _type: ConnectionType;
	private var _source: ConnectableSource;
	private var _destination: ConnectableDestination;
	private var _decayingConstant: Float;
	private var _associatingConstant: Float;
	private var _disassociatingConstant: Float;
	private var _weight: Float;
	private var _input: Float;
	private var _output: Float;
	
	public function new(template: ConnectionTemplate) 
	{
		super();
		
	}
	
	/* INTERFACE ConnectionConfiguration */
	public function getConnectionType():ConnectionType { return this._type; }
	public function getSource():ConnectableSource { return this._source; }
	public function getDestination():ConnectableDestination { return this._destination; }
	public function getDecayingConstant():Float { return this._decayingConstant; }
	public function getAssociatingConstant():Float { return this._associatingConstant; }
	public function getDisassociatingConstant():Float { return this._disassociatingConstant; }
	public function getWeight():Float { return this._weight; }
}