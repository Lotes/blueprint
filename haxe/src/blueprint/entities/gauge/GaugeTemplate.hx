package blueprint.entities.gauge;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class GaugeTemplate
	implements GaugeConfigurator<GaugeTemplate>
	implements GaugeConfiguration
{
	
	private var _threshold: Float = 0;
	
	private var _maximum: Float = 1;
	

	
	public function getThreshold(): Float { return _threshold; }
	
	public function getMaximum(): Float { return _maximum; }
	

	/* INTERFACE GaugeConfigurator<GaugeTemplate> */
	
	public function threshold(value:Float): Template { _threshold = value; return this; }
	
	public function maximum(value:Float): Template { _maximum = value; return this; }
	
}