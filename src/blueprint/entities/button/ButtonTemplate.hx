package blueprint.entities.button;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class ButtonTemplate
	implements ButtonConfigurator<ButtonTemplate>
	implements ButtonConfiguration
{
	
	private var _minimum: Float = 0;
	
	private var _maximum: Float = 1;
	
	private var _enabled: Bool = false;
	

	public function new() {}

	
	public function getMinimum(): Float { return _minimum; }
	
	public function getMaximum(): Float { return _maximum; }
	
	public function getEnabled(): Bool { return _enabled; }
	

	/* INTERFACE ButtonConfigurator<ButtonTemplate> */
	
	public function minimum(value: Float): ButtonTemplate { _minimum = value; return this; }
	
	public function maximum(value: Float): ButtonTemplate { _maximum = value; return this; }
	
	public function enabled(value: Bool): ButtonTemplate { _enabled = value; return this; }
	
}