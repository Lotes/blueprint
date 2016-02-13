package blueprint.entities.button;

class MutableButton extends Button
{
	public function new(minimum: Float, maximum: Float, enabled: Bool) 
	{
		super(minimum, maximum, enabled);
	}
	public function setOutput(value: Float) { _output = value; }
}