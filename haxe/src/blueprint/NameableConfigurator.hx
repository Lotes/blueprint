package blueprint;

interface NameableConfigurator<T>
{
	function name(name: String): T;
}