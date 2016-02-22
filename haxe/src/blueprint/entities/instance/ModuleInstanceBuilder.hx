package blueprint.entities.instance;

class ModuleInstanceBuilder 
	implements Builder<ModuleInstance>
	implements TemplateBuilder<ModuleInstanceTemplate>
{
	/* VARIABLES */
	private var _module: Module;
	private var _actualParameters: Map<String, Dynamic> = new Map<String, Dynamic>();
	
	public function new(instanceBuilder: ModuleInstanceCreator, template: ModuleInstanceTemplate) 
	{
		this._module = template.getModule();
		var parameters = template.getParameters();
		for(name in parameters.keys())
			this._actualParameters.set(name, parameters.get(name));
	}	
	
	/* SETTERS */
	public function module(value: Module): ModuleInstanceBuilder
	{
		if (this._module != null)
			throw new blueprint.Error("Can set module only once!");
		this._module = value;
		var formalParameters = this._module.getParameters();
		for (name in formalParameters.keys())
			this._actualParameters.set(name, formalParameters.get(name).getDefaultValue());
		return this;
	}
	
	public function parameter(name: String, value: Dynamic): ModuleInstanceBuilder
	{
		if (this._module == null)
			throw new blueprint.Error("Set module first!");
		if (!this._module.getParameters().exists(name))
			throw new blueprint.Error("Unknown parameter '" + name+"'!");
		//TODO check type
		this._actualParameters.set(name, value);
		return this;
	}
	
	/* INTERFACE Builder<ModuleInstance> */
	public function build(): ModuleInstance 
	{
		if (this._module == null)
			throw new blueprint.Error("No module specified!");
		var creator = new ModuleInstanceCreator(this._actualParameters);
		this._module.instantiate(creator);
		return creator.getResult();
	}
	
	/* INTERFACE TemplateBuilder<ModuleInstanceTemplate> */
	public function template(): ModuleInstanceTemplate
	{
		var template = new ModuleInstanceTemplate();
		template.module(this._module);
		for (name in this._actualParameters.keys())
			template.parameter(name, this._actualParameters.get(name));
		return template;
	}
}