package blueprint.entities.light;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class LightTemplate
	implements LightConfigurator<LightTemplate>
	implements LightConfiguration
{
	
	private var _threshold: Float = 1;
	

	
	public function getThreshold(): Float { return _threshold; }
	

	/* INTERFACE LightConfigurator<LightTemplate> */
	
	public function threshold(value: Float): LightTemplate { _threshold = value; return this; }
	
}