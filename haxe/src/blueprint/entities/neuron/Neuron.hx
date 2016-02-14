package blueprint.entities.neuron;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class Neuron
	extends Node
	implements NeuronConfiguration
	implements ConnectableDestination
	implements ConnectableSource
	
{
	/* VARIABLES */

	private var _threshold: Float = 1;

	private var _maximum: Float = 1;

	private var _factor: Float = 1;

	private var _input: Float = 0;

	private var _output: Float = 0;

	/* CONSTRUCTOR  */
	private function new(template: NeuronTemplate)
	{
		super();
		
		this._threshold = template.getThreshold();
		
		this._maximum = template.getMaximum();
		
		this._factor = template.getFactor();
		
	}
	/* GETTERS */

	public function getThreshold(): Float { return this._threshold; }

	public function getMaximum(): Float { return this._maximum; }

	public function getFactor(): Float { return this._factor; }

	public function getInput(): Float { return this._input; }

	public function getOutput(): Float { return this._output; }


	/* INTERFACE ConnectableSource */
	public function getOutgoingConnections():Array<Connection> { return _outgoingConnections; }
	public function connectAsSource(connection:Connection) { _outgoingConnections.push(connection); }


	/* INTERFACE ConnectableDestination */
	public function getIngoingConnections():Array<Connection> { return _ingoingConnections; }
	public function connectAsDestination(connection:Connection) { _ingoingConnections.push(connection); }

}