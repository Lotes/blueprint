package blueprint.entities.button;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

import blueprint.entities.Builder;
import blueprint.entities.instance.ModuleInstanceBuilder;
import blueprint.entities.TemplateBuilder;
import blueprint.Error;

class ButtonBuilder
	implements ButtonConfigurator<ButtonBuilder>
	implements NameConfigurator<ButtonBuilder>
	implements Builder<Button>
	implements TemplateBuilder<ButtonTemplate>
{
	/* VARIABLES */
	private var _moduleInstanceBuilder: ModuleInstanceBuilder;
	private var _finished: Bool = false;
	private var _name: String = null;
	
	private var _minimum: Float;
	
	private var _maximum: Float;
	
	private var _enabled: Bool;
	

	/* CONSTRUCTOR */
	public function new(instanceBuilder: ModuleInstanceBuilder, template: ButtonTemplate)
	{
		this._moduleBuilder = moduleBuilder;
		
		this._minimum = template.getMinimum();
		
		this._maximum = template.getMaximum();
		
		this._enabled = template.getEnabled();
		
	}

	/* INTERFACE Builder<Button> */
	public function build(): Button
	{
		if (this._finished)
			throw new Error("Button was already built!");
		var entity = new Neuron(template());
		_moduleBuilder.add(entity);
		if(this._name != null)
			_moduleBuilder.alias(name, entity);
		this._finished = true;
		return entity;
	}

	/* INTERFACE TemplateBuilder<Button> */
	public function template(): ButtonTemplate
	{
		var result = new ButtonTemplate();
		
		result.minimum(this._minimum);
		
		result.maximum(this._maximum);
		
		result.enabled(this._enabled);
		
		return result;
	}

	/* INTERFACE ButtonConfigurator<ButtonBuilder> */
	
	public function minimum(value: Float): ButtonBuilder
	{
		this._minimum = value;
		return this;
	}
	
	public function maximum(value: Float): ButtonBuilder
	{
		this._maximum = value;
		return this;
	}
	
	public function enabled(value: Bool): ButtonBuilder
	{
		this._enabled = value;
		return this;
	}
	

	/* INTERFACE NameConfigurator<ButtonBuilder> */
	public function name(name:String): ButtonBuilder
	{
		this._name = name;
		return this;
	}
}
