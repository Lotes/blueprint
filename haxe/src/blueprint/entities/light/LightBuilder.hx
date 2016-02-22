package blueprint.entities.light;

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD!
 */

import blueprint.entities.Builder;
import blueprint.entities.instance.IModuleInstanceCreator;
import blueprint.entities.TemplateBuilder;
import blueprint.Error;

class LightBuilder
	implements LightConfigurator<LightBuilder>
	implements NameConfigurator<LightBuilder>
	implements Builder<Light>
	implements TemplateBuilder<LightTemplate>
{
	/* VARIABLES */
	private var _moduleInstanceBuilder: IModuleInstanceCreator;
	private var _finished: Bool = false;
	private var _name: String = null;
	
	private var _threshold: Float;
	

	/* CONSTRUCTOR */
	public function new(instanceBuilder: IModuleInstanceCreator, template: LightTemplate)
	{
		this._moduleInstanceBuilder = instanceBuilder;
		
		this._threshold = template.getThreshold();
		
	}

	/* INTERFACE Builder<Light> */
	public function build(): Light
	{
		if (this._finished)
			throw new Error("Light was already built!");
		var entity = new MutableLight(template());
		_moduleInstanceBuilder.add(entity);
		if(this._name != null)
			_moduleInstanceBuilder.alias(this._name, entity);
		this._finished = true;
		return entity;
	}

	/* INTERFACE TemplateBuilder<Light> */
	public function template(): LightTemplate
	{
		var result = new LightTemplate();
		
		result.threshold(this._threshold);
		
		return result;
	}

	/* INTERFACE LightConfigurator<LightBuilder> */
	
	public function threshold(value: Float): LightBuilder
	{
		this._threshold = value;
		return this;
	}
	

	/* INTERFACE NameConfigurator<LightBuilder> */
	public function name(name:String): LightBuilder
	{
		this._name = name;
		return this;
	}
}
