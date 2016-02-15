package blueprint.entities.group;

class Group
	extends Node
	implements GroupConfiguration
{
	/* VARIABLES */
	private var _entities: Array<Entity>;

	/* CONSTRUCTOR  */
	private function new(template: GroupTemplate)
	{
		super();
		this._entities = template;
	}
	
	/* GETTERS */
	public function getEntities(): Array<Entity> { return this._entities; }
}