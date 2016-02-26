package blueprint.entities.instance ;

import blueprint.entities.connection.*;

class ModuleInstance
	extends Node 
{
	private var _nodes: Array<Node> = new Array<Node>();
	private var _connections: Array<Connection> = new Array<Connection>();
	private var _names: Map<String, Entity> = new Map<String, Entity>();
	
	public function new(nodes: Array<Node>, connections: Array<Connection>, names: Map<String, Entity>) 
	{
		super();
		this._nodes = nodes;
		this._connections = connections;
		this._names = names;
	}	
	
	public function getEntityByName(name: String) : Entity
	{
		if (!this._names.exists(name))
			throw new blueprint.Error("No entity '"+name+"' given in this module instance!");
		return this._names.get(name);
	}
	
	public function getEntityNames(): Iterator<String> { return this._names.keys(); }
	
	public function getNodes(): Array<Node> { return this._nodes; }
	
	public function getConnections(): Array<Connection> { return this._connections; }
}