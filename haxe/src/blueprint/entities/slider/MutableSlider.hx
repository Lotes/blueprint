package blueprint.entities.slider;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

class MutableSlider extends Slider
{
	public function new(template: SliderTemplate)
	{
		super(template);
	}
	
	public function setPosition(value: Float) { this._position = value; }
	
	public function setOutput(value: Float) { this._output = value; }
	
}