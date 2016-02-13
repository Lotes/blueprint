package blueprint.entities.neuron ;
import blueprint.entities.Builder;
import blueprint.entities.instance.ModuleBuilder;
import blueprint.Error;

class NeuronBuilder
	implements NeuronConfigurator<NeuronBuilder>
	implements NameConfigurator<NeuronBuilder>
	implements Builder<Neuron>
{
	private var _moduleBuilder: ModuleBuilder;
	private var _finished: Bool = false;
	private var _threshold: Float;
	private var _maximum: Float;
	private var _factor: Float;
	private var _name: String = null;
	
	public function new(moduleBuilder: ModuleBuilder, template: NeuronTemplate) 
	{
		this._moduleBuilder = moduleBuilder;
		this._threshold = template.getThreshold();
		this._maximum = template.getMaximum();
		this._factor = template.getFactor();
	}
	
	/* INTERFACE blueprint.entities.Builder.Builder<T> */	
	public function build(): Neuron
	{
		if (this._finished)
			throw new Error("Neuron was already built!");
		var neuron = new Neuron(_threshold, _maximum, _factor);
		_moduleBuilder.add(neuron);
		if(this._name != null)
			_moduleBuilder.alias(name, neuron);
		this._finished = true;
		return neuron;
	}
	
	/* INTERFACE blueprint.NeuronConfigurator.NeuronConfigurator<T> */
	public function threshold(value:Float):NeuronBuilder 
	{
		this._threshold = value;
		return this;
	}
	
	public function maximum(value:Float):NeuronBuilder 
	{
		this._maximum = value;
		return this;
	}
	
	public function factor(value:Float):NeuronBuilder
	{
		this._factor = value;
		return this;
	}
	
	/* INTERFACE blueprint.NameableConfigurator.NameableConfigurator<T> */
	public function name(name:String):NeuronBuilder
	{
		this._name = name;
		return this;
	}
}
