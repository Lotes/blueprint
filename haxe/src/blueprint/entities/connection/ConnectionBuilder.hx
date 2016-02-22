package blueprint.entities.connection;

import blueprint.entities.connection.*;
import blueprint.entities.instance.*;

class ConnectionBuilder
	implements ConnectionConfigurator<ConnectionBuilder>
	implements NameConfigurator<ConnectionBuilder>
	implements Builder<Array<Connection>>
	implements TemplateBuilder<ConnectionTemplate>
{
	/* VARIABLES */
	private var _creator: IModuleInstanceCreator;
	private var _name: String = null;
	private var _type: ConnectionType;
	private var _source: ConnectableSource;
	private var _destination: ConnectableDestination;
	private var _decayingConstant: Float;
	private var _associatingConstant: Float;
	private var _disassociatingConstant: Float;
	private var _weight: Float;
	
	public function new(creator: IModuleInstanceCreator, template: ConnectionTemplate) 
	{
		this._creator = creator;
		this._type = template.getConnectionType();
		this._source = template.getSource();
		this._destination = template.getDestination();
		this._decayingConstant = template.getDecayingConstant();
		this._associatingConstant = template.getAssociatingConstant();
		this._disassociatingConstant = template.getDisassociatingConstant();
		this._weight = template.getWeight();
	}
	
	/* INTERFACE ConnectionConfigurator<ConnectionBuilder> */
	public function type(value:ConnectionType): ConnectionBuilder
	{
		this._type = value;
		return this;
	}
	
	public function source(value: ConnectableSource): ConnectionBuilder
	{
		this._source = value;
		return this;
	}
	
	public function destination(value: ConnectableDestination): ConnectionBuilder
	{
		this._destination = value;
		return this;
	}
	
	public function decaying(value: Float): ConnectionBuilder
	{
		this._decayingConstant = value;
		return this;
	}
	
	public function associating(value: Float): ConnectionBuilder
	{
		this._associatingConstant = value;
		return this;
	}
	
	public function disassociating(value: Float): ConnectionBuilder
	{
		this._disassociatingConstant = value;
		return this;
	}
	
	public function weight(value: Float): ConnectionBuilder 
	{
		this._weight = value;
		return this;
	}
	
	/* INTERFACE NameConfigurator<ConnectionBuilder> */
	public function name(name: String): ConnectionBuilder 
	{
		this._name = name;
		return this;
	}
	
	/* INTERFACE Builder<Array<Connection>> */
	public function build(): Array<Connection>
	{
		if (this._source == null)
			throw new blueprint.Error("No source specified!");
		if (this._destination == null)
			throw new blueprint.Error("No destination specified!");
		var sources
		var connections = new Array<Connection>();
		return connections;
	}
	
	private function addConnection(source: ConnectableSource, destination: ConnectableDestination): Connection
	{
		return null;
	}
	
	/* INTERFACE TemplateBuilder<ConnectionTemplate> */
	public function template(): ConnectionTemplate
	{
		var result = new ConnectionTemplate();
		result
			.associating(this._associatingConstant)
			.decaying(this._decayingConstant)
			.destination(this._destination)
			.disassociating(this._disassociatingConstant)
			.source(this._source)
			.type(this._type)
			.weight(this._weight);
		return result;
	}
}