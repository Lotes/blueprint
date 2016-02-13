package blueprint.entities.neuron ;

class Neuron 
	extends Node
	implements ConnectableDestination
	implements ConnectableSource
	implements NeuronConfiguration
{
	private var _threshold: Float;
	private var _maximum: Float;
	private var _factor: Float;
	private var _input: Float = 0;
	private var _output: Float = 0;
	private var _ingoingConnections: Array<Connection> = new Array<Connection>(); 
	private var _outgoingConnections: Array<Connection> = new Array<Connection>(); 

	private function new(threshold: Float, maximum: Float, factor: Float) 
	{
		super();
		this._threshold = threshold;
		this._maximum = maximum;
		this._factor = factor;
	}	
	
	public function getInput(): Float { return _input; }
	public function getOutput(): Float { return _output; }
	public function getActivationLevel(): Float 
	{
		if (_threshold == 0)
			return 1;
		return Math.max(0, Math.min(1, _input / _threshold));
	}
	
	/* INTERFACE blueprint.NeuronConfiguration */
	public function getThreshold():Float { return _threshold; } 
	public function getMaximum():Float { return _maximum; }
	public function getFactor():Float { return _factor; }
	
	/* INTERFACE blueprint.ConnectableDestination */
	public function getIngoingConnections():Array<Connection> { return _ingoingConnections; }
	public function connectAsDestination(connection:Connection) { _ingoingConnections.push(connection); }
	
	/* INTERFACE blueprint.ConnectableSource */
	public function getOutgoingConnections():Array<Connection> { return _outgoingConnections; }
	public function connectAsSource(connection:Connection) { _outgoingConnections.push(connection); }
}