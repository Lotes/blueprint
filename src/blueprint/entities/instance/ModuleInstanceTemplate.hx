package blueprint.entities.instance;

/**
 * ...
 * @author Markus Rudolph
 */
class ModuleInstanceTemplate
{
	/* VARIABLES */
	private var _module: Module = null;
	private var _actualParameters: Map<String, Dynamic> = new Map<String, Dynamic>();
	
	public function new() {}
	
	/* GETTERS */
	public function getModule(): Module { return this._module; }
	public function getParameters(): Map<String, Dynamic> { return this._actualParameters; }
	
	/* SETTERS */
	public function module(value: Module): ModuleInstanceTemplate
	{
		if (this._module != null)
			throw new blueprint.Error("Can set module only once!");
		this._module = value;
		var formalParameters = this._module.getParameters();
		for (name in formalParameters.keys())
			this._actualParameters.set(name, formalParameters.get(name).getDefaultValue());
		return this;
	}
	
	public function parameter(name: String, value: Dynamic): ModuleInstanceTemplate
	{
		if (this._module == null)
			throw new blueprint.Error("Set module first!");
		if (!this._module.getParameters().exists(name))
			throw new blueprint.Error("Unknown parameter '" + name+"'!");
		//TODO check type
		this._actualParameters.set(name, value);
		return this;
	}
}