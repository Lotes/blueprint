package blueprint.entities.neuron;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class NeuronTemplate
	implements NeuronConfigurator<NeuronTemplate>
	implements NeuronConfiguration
{
	
	private var _threshold: Float = 1;
	
	private var _maximum: Float = 1;
	
	private var _factor: Float = 1;
	

	
	public function getThreshold(): Float { return _threshold; }
	
	public function getMaximum(): Float { return _maximum; }
	
	public function getFactor(): Float { return _factor; }
	

	/* INTERFACE NeuronConfigurator<NeuronTemplate> */
	
	public function threshold(value:Float): Template { _threshold = value; return this; }
	
	public function maximum(value:Float): Template { _maximum = value; return this; }
	
	public function factor(value:Float): Template { _factor = value; return this; }
	
}