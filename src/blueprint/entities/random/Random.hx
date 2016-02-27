package blueprint.entities.random;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

import blueprint.entities.connection.*;

class Random
	extends Node
	implements RandomConfiguration
	implements ConnectableSource
	
{
	/* VARIABLES */

	private var _minimum: Float = 0;

	private var _maximum: Float = 1;

	private var _seed: Int = 13;

	private var _output: Float = 0;

	/* CONSTRUCTOR  */
	private function new(template: RandomTemplate)
	{
		super();
		
		this._minimum = template.getMinimum();
		
		this._maximum = template.getMaximum();
		
		this._seed = template.getSeed();
		
	}
	/* GETTERS */

	public function getMinimum(): Float { return this._minimum; }

	public function getMaximum(): Float { return this._maximum; }

	public function getSeed(): Int { return this._seed; }

	public function getOutput(): Float { return this._output; }


	/* INTERFACE ConnectableSource */
	private var _outgoingConnections: Array<Connection> = new Array<Connection>();
	public function getOutgoingConnections(): Array<Connection> { return _outgoingConnections; }
	public function connectAsSource(connection: Connection) { _outgoingConnections.push(connection); }


}