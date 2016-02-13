package blueprint.entities;

interface Builder<T>
{
	function build(): T;
}