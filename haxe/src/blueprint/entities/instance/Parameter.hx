package blueprint.entities.instance;

class Parameter
{
	/* VARIABLES */
	private var _name: String;
	private var _type: ParameterType;
	private var _defaultValue: Dynamic;
	
	public function new(name: String, type: ParameterType, defaultValue: Dynamic) 
	{
		this._name = name;
		this._type = type;
		this._defaultValue = defaultValue;
	}
	
	/* GETTERS */
	public function getName(): String { return this._name; } 
	public function getParameterType(): ParameterType { return this._type; } 
	public function getDefaultValue(): Dynamic { return this._defaultValue; }
}