package blueprint.entities.instance ;
import blueprint.entities.button.*;
import blueprint.entities.slider.*;
import blueprint.entities.random.*;
import blueprint.entities.light.*;
import blueprint.entities.gauge.*;
import blueprint.entities.neuron.*;

interface ModuleInstanceBuilder
{
	function add(node: Node): Void;
	//processor nodes
	function neuron(template: NeuronTemplate = null): NeuronBuilder;
	//input nodes
	function button(template: ButtonTemplate = null): ButtonBuilder;
	function slider(template: SliderTemplate = null): SliderBuilder;
	function random(template: RandomTemplate = null): RandomBuilder;
	//output nodes
	function light(template: LightTemplate = null): LightBuilder;
	function gauge(template: GaugeTemplate = null): GaugeBuilder;
	//group nodes
	function group(): GroupBuilder;
	function instance(template: ModuleInstance): ModuleInstanceBuilder;
	//connections
	function connect(template: ConnectionTemplate = null): ConnectionBuilder;
	//aliases
	function alias(name: String, entity: Entity): Void;
	//query?
		//function query(queryString: String): Entity;
}