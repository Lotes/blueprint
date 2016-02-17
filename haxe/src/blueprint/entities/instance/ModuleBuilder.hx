package blueprint.entities.instance;

class ModuleBuilder
	implements blueprint.entities.Builder<Module>
{
	/* VARIABLES */
	private var _name: String;
	private var _description: String;
	private var _parameters: Map<String, Parameter> = new Map<String, Parameter>();
	
	public function new() 
	{
		
	}	
	
	/* GETTERS */
	public function getName(): String { return this._name; }
	public function getDescription(): String { return this._description; }
	
	/* SETTERS */
	public function name(value: String): ModuleBuilder
	{
		this._name = value;
		return this;
	}
	
	public function description(value: String): ModuleBuilder
	{
		this._description = value;
		return this;
	}
	
	public function parameter(name: String, type: ParameterType, defaultValue: Dynamic): ModuleBuilder
	{
		this._parameters.set(name, new Parameter(name, type, defaultValue));
		return this;
	}
	
	/* INTERFACE Builder<Module> */
	public function build(instantiate: ModuleInstanceBuilder => Void): Module 
	{
		return new Module(this._name, this._description, this._parameters, instantiate);
	}
}