package blueprint.entities.instance ;

class Module
{
	/* VARIABLES */
	private var _name: String;
	private var _description: String;
	private var _parameters: Map<String, Parameter>;
	private var _instantiate: IModuleInstanceCreator -> Void;
	
	public function new(name: String, description: String, 
		parameters: Map<String, Parameter>, instantiate: IModuleInstanceCreator -> Void) 
	{
		this._name = name;
		this._description = description;
		this._parameters = parameters;
		this._instantiate = instantiate;
	}
	
	/* GETTERS */
	public function getName(): String { return this._name; }
	public function getDescription(): String { return this._description; }
	public function getParameters(): Map<String, Parameter> { return this._parameters; }
	
	/* BUILD ACTION */
	public function instantiate(creator: IModuleInstanceCreator): Void { this._instantiate(creator); }
}