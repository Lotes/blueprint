package blueprint.entities.group;

import blueprint.entities.Builder;
import blueprint.entities.instance.ModuleInstanceBuilder;
import blueprint.entities.TemplateBuilder;
import blueprint.Error;

class GroupBuilder
	implements GroupConfigurator<GroupBuilder>
	implements NameConfigurator<GroupBuilder>
	implements Builder<Group>
	implements TemplateBuilder<GroupTemplate>
{
	/* VARIABLES */
	private var _moduleInstanceBuilder: ModuleInstanceBuilder;
	private var _finished: Bool = false;
	private var _name: String = null;
	private var _entities: Array<Entity>;

	/* CONSTRUCTOR */
	public function new(instanceBuilder: ModuleInstanceBuilder, template: GroupTemplate)
	{
		this._moduleBuilder = moduleBuilder;
		this._entities = template.getEntities().copy();
	}

	/* INTERFACE Builder<Group> */
	public function build(): Group
	{
		if (this._finished)
			throw new Error("Group was already built!");
		var entity = new Group(template());
		_moduleBuilder.add(entity);
		if(this._name != null)
			_moduleBuilder.alias(name, entity);
		this._finished = true;
		return entity;
	}

	/* INTERFACE TemplateBuilder<Group> */
	public function template(): GroupTemplate
	{
		var result = new GroupTemplate();
		for(entity in this._entities)
			result.add(entity);
		return result;
	}

	/* INTERFACE GroupConfigurator<GroupBuilder> */
	public function add(entity: Entity): GroupBuilder
	{
		this._entities.push(entity);
		return this;
	}

	/* INTERFACE NameConfigurator<GroupBuilder> */
	public function name(name:String): GroupBuilder
	{
		this._name = name;
		return this;
	}
}
