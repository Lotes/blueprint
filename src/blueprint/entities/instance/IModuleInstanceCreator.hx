package blueprint.entities.instance ;

import blueprint.entities.button.*;
import blueprint.entities.slider.*;
import blueprint.entities.random.*;
import blueprint.entities.light.*;
import blueprint.entities.gauge.*;
import blueprint.entities.neuron.*;
import blueprint.entities.group.*;
import blueprint.entities.connection.*;

interface IModuleInstanceCreator
{
	function add(node: Node): Void;
	function neuron(template: NeuronTemplate = null): NeuronBuilder;
	function button(template: ButtonTemplate = null): ButtonBuilder;
	function slider(template: SliderTemplate = null): SliderBuilder;
	function random(template: RandomTemplate = null): RandomBuilder;
	function light(template: LightTemplate = null): LightBuilder;
	function gauge(template: GaugeTemplate = null): GaugeBuilder;
	function group(template: GroupTemplate = null): GroupBuilder;
	function instance(template: ModuleInstanceTemplate = null): ModuleInstanceBuilder;
	function connect(template: ConnectionTemplate = null): ConnectionBuilder;
	function alias(name: String, entity: Entity): Void;
	function getParameter(name: String): Dynamic;
}