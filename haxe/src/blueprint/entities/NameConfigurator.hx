package blueprint.entities ;

interface NameConfigurator<T>
{
	function name(name: String): T;
}