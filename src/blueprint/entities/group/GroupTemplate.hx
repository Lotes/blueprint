package blueprint.entities.group;

class GroupTemplate
	implements GroupConfigurator<GroupTemplate>
	implements GroupConfiguration
{
	/* VARIABLES */
	private var _entities: Array<Entity> = new Array<Entity>();
	
	public function new() {}
	
	/* INTERFACE GroupConfigurator<GroupTemplate> */
	public function add(entity: Entity): GroupTemplate
	{
		this._entities.push(entity);
		return this;
	}
	
	/* INTERFACE GroupConfiguration */
	public function getEntities(): Array<Entity> 
	{
		return this._entities;
	}
}