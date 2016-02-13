package blueprint.entities.button;

interface ButtonConfigurator<T>
{
	function minimum(value:Float): T;
	function maximum(value:Float): T;
	function enabled(value:Bool): T;
}