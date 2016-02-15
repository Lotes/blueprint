package blueprint.entities.group;

interface GroupConfigurator<T>
{
	function add(entity: Entity): T;
}