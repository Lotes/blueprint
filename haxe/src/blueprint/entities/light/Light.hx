package blueprint.entities.light;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class Light
	extends Node
	implements LightConfiguration
	implements ConnectableDestination
	
{
	/* VARIABLES */

	private var _threshold: Float = 1;

	private var _enabled: Bool = false;

	private var _input: Float = 0;

	/* CONSTRUCTOR  */
	private function new(template: LightTemplate)
	{
		super();
		
		this._threshold = template.getThreshold();
		
	}
	/* GETTERS */

	public function getThreshold(): Float { return this._threshold; }

	public function getEnabled(): Bool { return this._enabled; }

	public function getInput(): Float { return this._input; }



	/* INTERFACE ConnectableDestination */
	private var _ingoingConnections: Array<Connection> = new Array<Connection>();
	public function getIngoingConnections(): Array<Connection> { return _ingoingConnections; }
	public function connectAsDestination(connection: Connection) { _ingoingConnections.push(connection); }

}