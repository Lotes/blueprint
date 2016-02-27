package blueprint.entities.instance;

import blueprint.entities.button.*;
import blueprint.entities.slider.*;
import blueprint.entities.random.*;
import blueprint.entities.light.*;
import blueprint.entities.gauge.*;
import blueprint.entities.neuron.*;
import blueprint.entities.group.*;
import blueprint.entities.connection.*;

class DummyModuleInstanceCreator implements IModuleInstanceCreator
{
	private var _name: String = null;
	
	public function new() 
	{	
	}	
	
	public function getLastName(): String { return this._name; }
	
	/* INTERFACE IModuleInstanceCreator */
	
	public function add(node:Node):Void 
	{
		
	}
	
	public function neuron(template:NeuronTemplate = null):NeuronBuilder 
	{
		return null;
	}
	
	public function button(template:ButtonTemplate = null):ButtonBuilder 
	{
		return null;
	}
	
	public function slider(template:SliderTemplate = null):SliderBuilder 
	{
		return null;
	}
	
	public function random(template:RandomTemplate = null):RandomBuilder 
	{
		return null;
	}
	
	public function light(template:LightTemplate = null):LightBuilder 
	{
		return null;
	}
	
	public function gauge(template:GaugeTemplate = null):GaugeBuilder 
	{
		return null;
	}
	
	public function group(template:GroupTemplate = null):GroupBuilder 
	{
		return null;
	}
	
	public function instance(template:ModuleInstanceTemplate = null):ModuleInstanceBuilder 
	{
		return null;
	}
	
	public function connect(template:ConnectionTemplate = null):ConnectionBuilder 
	{
		return null;
	}
	
	public function alias(name:String, entity:Entity):Void 
	{
		this._name = name;
		return null;
	}
	
	public function getParameter(name:String):Dynamic 
	{
		return null;
	}
}