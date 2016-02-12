package blueprint;
import js.html.Entity;

interface ModuleBuilder
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
	function instance(template: Module): InstanceBuilder;
	//connections
	function connect(template: ConnectionTemplate = null): ConnectionBuilder;
	//aliases
	function alias(name: String, entity: Entity): Void;
	//query?
	function query(queryString: String): Entity;
}