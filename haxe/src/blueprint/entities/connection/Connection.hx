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
	private var _input: Float = 0;
	private var _output: Float = 0;
	private var _ingoingConnections: Array<Connection> = new Array<Connection>();
	
	public function new(template: ConnectionTemplate) 
	{
		super();
		this._type = template.getConnectionType();
		this._source = template.getSource();
		this._destination = template.getDestination();
		this._decayingConstant = template.getDecayingConstant();
		this._associatingConstant = template.getAssociatingConstant();
		this._disassociatingConstant = template.getDisassociatingConstant();
		this._weight = template.getWeight();
	}
	
	/* INTERFACE ConnectionConfiguration */
	public function getConnectionType():ConnectionType { return this._type; }
	public function getSource():ConnectableSource { return this._source; }
	public function getDestination():ConnectableDestination { return this._destination; }
	public function getDecayingConstant():Float { return this._decayingConstant; }
	public function getAssociatingConstant():Float { return this._associatingConstant; }
	public function getDisassociatingConstant():Float { return this._disassociatingConstant; }
	public function getWeight():Float { return this._weight; }
	
	/* INTERFACE ConnectableDestination */
	public function getIngoingConnections():Array<Connection> { return this._ingoingConnections; }
	public function connectAsDestination(connection:Connection):Void { this._ingoingConnections.push(connection); }
}