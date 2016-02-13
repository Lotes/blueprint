package blueprint.entities.button ;
import blueprint.entities.Node;
import blueprint.entities.connection.Connection;

class Button
	extends Node
	implements ConnectableSource
	implements ButtonConfiguration
{
	private var _minimum: Float;
	private var _maximum: Float;
	private var _output: Float = 0;
	private var _enabled: Bool;
	private var _outgoingConnections: Array<Connection> = new Array<Connection>(); 
	
	public function new(minimum: Float, maximum: Float, enabled: Bool) 
	{
		super();
		this._minimum = minimum;
		this._maximum = maximum;
		this._enabled = enabled;
	}	
	
	public function getOutput(): Float { return _output; }
	
	/* INTERFACE blueprint.entities.ConnectableSource */	
	public function getOutgoingConnections():Array<Connection> { return _outgoingConnections; }
	public function connectAsSource(connection:Connection) { _outgoingConnections.push(connection); }
	
	/* INTERFACE blueprint.entities.button.ButtonConfiguration */
	public function getMinimum():Float { return _minimum; } 
	public function getMaximum():Float { return _maximum; } 
	public function getEnabled():Bool { return _enabled; }
}