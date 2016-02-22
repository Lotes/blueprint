package blueprint.entities.instance ;

import blueprint.entities.button.*;
import blueprint.entities.slider.*;
import blueprint.entities.random.*;
import blueprint.entities.light.*;
import blueprint.entities.gauge.*;
import blueprint.entities.neuron.*;
import blueprint.entities.group.*;
import blueprint.entities.connection.*;

class ModuleInstanceCreator implements IModuleInstanceCreator
{
	private var _parameters: Map<String, Dynamic> = new Map<String, Dynamic>();
	private var _nodes: Array<Node> = new Array<Node>();
	private var _connections: Array<Connection> = new Array<Connection>();
	private var _names: Map<String, Entity> = new Map<String, Entity>();
	private var _result: ModuleInstance = null;
	
	public function new(parameters: Map<String, Dynamic>)
	{
		//ATTENTION! Result will be filled by calling creator methods
		this._result = new ModuleInstance(this._nodes, this._connections, this._names);
		for (name in parameters.keys())
			this._parameters.set(name, parameters.get(name));
	}
	
	public function getResult(): ModuleInstance
	{
		return this._result;
	}
	
	public function getParameter(name: String): Dynamic
	{
		if (!this._parameters.exists(name))
			throw new blueprint.Error("No parameter '"+name+"' given!");
		return this._parameters.get(name);
	}
	
	public function add(node: Node): Void
	{
		if (node.getParent() != null)
			throw new blueprint.Error("Node was already added to another instance!");
		if (this._nodes.indexOf(node) != -1)
			throw new blueprint.Error("Node was already added to this instance!");
		node.setParent(this._result);
		this._nodes.push(node);
	}
	
	public function neuron(template: NeuronTemplate = null): NeuronBuilder
	{
		if (template == null)
			template = new NeuronTemplate();
		return new NeuronBuilder(this, template);
	}
	
	public function button(template: ButtonTemplate = null): ButtonBuilder
	{
		if (template == null)
			template = new ButtonTemplate();
		return new ButtonBuilder(this, template);
	}
	
	public function slider(template: SliderTemplate = null): SliderBuilder
	{
		if (template == null)
			template = new SliderTemplate();
		return new SliderBuilder(this, template);
	}
	
	public function random(template: RandomTemplate = null): RandomBuilder
	{
		if (template == null)
			template = new RandomTemplate();
		return new RandomBuilder(this, template);
	}
	
	public function light(template: LightTemplate = null): LightBuilder
	{
		if (template == null)
			template = new LightTemplate();
		return new LightBuilder(this, template);
	}
	
	public function gauge(template: GaugeTemplate = null): GaugeBuilder
	{
		if (template == null)
			template = new GaugeTemplate();
		return new GaugeBuilder(this, template);
	}
	
	public function group(template: GroupTemplate = null): GroupBuilder
	{
		if (template == null)
			template = new GroupTemplate();
		return new GroupBuilder(this, template);
	}
	
	public function instance(template: ModuleInstanceTemplate = null): ModuleInstanceBuilder
	{
		if (template == null)
			template = new ModuleInstanceTemplate();
		return new ModuleInstanceBuilder(this, template);
	}
	
	public function connect(template: ConnectionTemplate = null): ConnectionBuilder
	{
		if (template == null)
			template = new ConnectionTemplate();
		return new ConnectionBuilder(this, template);
	}
	
	public function alias(name: String, entity: Entity): Void
	{
		var e = entity.getParent();
		var found = false;
		while (e != null && !found)
		{
			if (e == this._result)
				found = true;
			e = e.getParent();
		}
		if (!found)
			throw new blueprint.Error("Entity is not part of this instance!");
		this._names.set(name, entity);
	}
}