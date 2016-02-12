package blueprint;

class NeuronTemplate implements NeuronConfigurator<NeuronTemplate>, NeuronConfiguration
{
	private var _threshold: Float = 1;
	private var _maximum: Float = 1;
	private var _factor: Float = 1;
	
	public function getThreshold(): Float { return _threshold; }
	public function getMaximum(): Float { return _maximum; }
	public function getFactor(): Float { return _factor; }
	
	/* INTERFACE blueprint.ModuleBuilder.NeuronConfigurator<T> */
	public function threshold(value:Float): NeuronTemplate { _threshold = value; return this; }
	public function maximum(value:Float): NeuronTemplate { _maximum = value; return this; }
	public function factor(value:Float): NeuronTemplate { _factor = value; return this; }
}