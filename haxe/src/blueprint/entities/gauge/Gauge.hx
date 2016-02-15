package blueprint.entities.gauge;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class Gauge
	extends Node
	implements GaugeConfiguration
	implements ConnectableDestination
	
{
	/* VARIABLES */

	private var _threshold: Float = 0;

	private var _maximum: Float = 1;

	private var _input: Float = 0;

	private var _position: Float = 0;

	/* CONSTRUCTOR  */
	private function new(template: GaugeTemplate)
	{
		super();
		
		this._threshold = template.getThreshold();
		
		this._maximum = template.getMaximum();
		
	}
	/* GETTERS */

	public function getThreshold(): Float { return this._threshold; }

	public function getMaximum(): Float { return this._maximum; }

	public function getInput(): Float { return this._input; }

	public function getPosition(): Float { return this._position; }



	/* INTERFACE ConnectableDestination */
	private var _ingoingConnections: Array<Connection> = new Array<Connection>();
	public function getIngoingConnections(): Array<Connection> { return _ingoingConnections; }
	public function connectAsDestination(connection: Connection) { _ingoingConnections.push(connection); }

}