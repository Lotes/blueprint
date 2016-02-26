package blueprint.entities.group;

class Group
	extends Node
	implements GroupConfiguration
{
	/* VARIABLES */
	private var _entities: Array<Entity>;

	/* CONSTRUCTOR  */
	public function new(template: GroupTemplate)
	{
		super();
		this._entities = template.getEntities().copy();
	}
	
	/* GETTERS */
	public function getEntities(): Array<Entity> { return this._entities; }
}