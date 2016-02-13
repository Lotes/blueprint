package blueprint.entities.neuron ;

interface NeuronConfiguration 
{
	function getThreshold(): Float;
	function getMaximum(): Float;
	function getFactor(): Float;
}