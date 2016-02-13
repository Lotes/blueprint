package blueprint.entities.button;

class ButtonTemplate
	implements ButtonConfigurator<ButtonTemplate>
	implements ButtonConfiguration
{
	private var _minimum: Float = 0;
	private var _maximum: Float = 1;
	private var _enabled: Bool = false;
	
	public function getMinimum(): Float { return _minimum; }
	public function getMaximum(): Float { return _maximum; }
	public function getEnabled(): Bool { return _enabled; }
	
	/* INTERFACE blueprint.entities.button.ButtonConfigurator<T> */
	public function minimum(value:Float): ButtonTemplate { _minimum = value; return this; }
	public function maximum(value:Float): ButtonTemplate { _maximum = value; return this; }
	public function enabled(value:Bool): ButtonTemplate { _enabled = value; return this; }
}