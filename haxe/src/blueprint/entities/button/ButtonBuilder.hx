package blueprint.entities.button;

class ButtonBuilder
	implements ButtonConfigurator<ButtonBuilder>
	implements NameConfigurator<ButtonBuilder>
	implements Builder<Button>
{
	private var _moduleBuilder: ModuleBuilder;
	private var _finished: Bool = false;
	private var _minimum: Float;
	private var _maximum: Float;
	private var _enabled: Bool;
	private var _name: String = null;
	
	public function new(moduleBuilder: ModuleBuilder, template: ButtonTemplate) 
	{
		this._moduleBuilder = moduleBuilder;
		this._minimum = template.getMinimum();
		this._maximum = template.getMaximum();
		this._enabled = template.getEnabled();
	}
	
	/* INTERFACE blueprint.entities.button.ButtonConfigurator.ButtonConfigurator<T> */
	public function minimum(value:Float):ButtonBuilder
	{
		this._minimum = value;
		return this;
	}
	
	public function maximum(value:Float):ButtonBuilder
	{
		this._maximum = value;
		return this;
	}
	
	public function enabled(value:Bool):ButtonBuilder
	{
		this._enabled = value;
		return this;
	}
	
	/* INTERFACE blueprint.entities.NameConfigurator.NameConfigurator<T> */
	public function name(name:String):ButtonBuilder
	{
		this._name = value;
		return this;
	}
	
	/* INTERFACE blueprint.entities.Builder.Builder<T> */	
	public function build():Button 
	{
		if (this._finished)
			throw new Error("Button was already built!");
		var button = new Button(_minimum, _maximum, _enabled);
		_moduleBuilder.add(button);
		if(this._name != null)
			_moduleBuilder.alias(name, button);
		this._finished = true;
		return button;
	}
}