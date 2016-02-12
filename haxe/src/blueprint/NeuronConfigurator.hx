package blueprint;

interface NeuronConfigurator<T>
{
	function threshold(value: Float): T;
	function maximum(value: Float): T;
	function factor(value: Float): T;
}