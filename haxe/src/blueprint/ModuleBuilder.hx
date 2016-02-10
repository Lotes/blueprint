package blueprint;

interface ModuleBuilder
{
	function addNode(node: Node): Void;
	function addConnections(source: ConnectableSource, destination: ConnectableDestination, options: Int): Array<Connection>;
	function addGroup(nodes: Array<Node>): Group;
	function registerNodeAs(node: Node, name: String): Void;
	function registerConnectionAs(connection: Connection, name: String): Void;
}