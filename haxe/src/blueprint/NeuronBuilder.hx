package blueprint;

class NeuronBuilder implements NeuronConfigurator<NeuronBuilder>, NameableConfigurator<NeuronBuilder>
{
	public function new(moduleBuilder: ModuleBuilder) 
	{
		
	}
	
	public function build(): Neuron
	{
		
	}
	
	/* INTERFACE blueprint.NeuronConfigurator.NeuronConfigurator<T> */
	
	public function threshold(value:Float):T 
	{
		
	}
	
	public function maximum(value:Float):T 
	{
		
	}
	
	public function factor(value:Float):T 
	{
		
	}
	
	/* INTERFACE blueprint.NameableConfigurator.NameableConfigurator<T> */
	
	public function name(name:String):T 
	{
		
	}
}
