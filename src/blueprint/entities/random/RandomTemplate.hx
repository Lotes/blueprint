package blueprint.entities.random;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class RandomTemplate
	implements RandomConfigurator<RandomTemplate>
	implements RandomConfiguration
{
	
	private var _minimum: Float = 0;
	
	private var _maximum: Float = 1;
	
	private var _seed: Int = 13;
	

	public function new() {}

	
	public function getMinimum(): Float { return _minimum; }
	
	public function getMaximum(): Float { return _maximum; }
	
	public function getSeed(): Int { return _seed; }
	

	/* INTERFACE RandomConfigurator<RandomTemplate> */
	
	public function minimum(value: Float): RandomTemplate { _minimum = value; return this; }
	
	public function maximum(value: Float): RandomTemplate { _maximum = value; return this; }
	
	public function seed(value: Int): RandomTemplate { _seed = value; return this; }
	
}