package blueprint.entities;

import blueprint.entities.instance.*;

class Entity
{
	private var _parent: ModuleInstance = null;
	public function new() { }
	public function getParent(): ModuleInstance { return this._parent; }
	public function setParent(parent: ModuleInstance): Void 
	{ 
		if (this._parent != null)
			throw new blueprint.Error("Parent can only be set once!");
		this._parent = parent;
	}
}