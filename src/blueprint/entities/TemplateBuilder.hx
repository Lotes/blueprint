package blueprint.entities;

interface TemplateBuilder<T>
{
	function template(): T;
}