package editor;

import editor.Helpers;
import js.Error;

class Module extends PropertiesObject
{
  private var nodes = new Array<Node>();
  private var connections = new Array<Connection>();
  
  public function new() 
  {
    super();
    addProperty(
      "name", 
      function(data) { data.set("name", "Module"); },
      function(data) { data.remove("name"); },
      function(data) { return cast(data.get("name"), String); },
      function(data, value) { 
        if (!Helpers.isNamespacedIdentifier(value))
          throw new Error("This is not a valid module name!");
        data.set("name", value); 
      }
    );
    addProperty(
      "nodes", 
      function(data) { data.set("nodes", nodes); },
      function(data) { data.remove("nodes"); },
      function(data) { return cast(data.get("nodes"), Array<Dynamic>); }
    );
  }
  
  public function getName(): String { return getPropertyValue("name"); }
  public function setName(name: String) { setPropertyValue("name", name); }
  
  public function getNodes(): Array<Node> { return nodes; }
   
  public function addNode(node: Node): Void 
  {
    var oldParent = node.getParent();
    if (oldParent != null)
      oldParent.removeNode(node);
    nodes.push(node);
    node.setParent(this);  
  }
  public function removeNode(node: Node): Void
  {
    if (node.getParent() != this)
      return;
    nodes.remove(node);
    node.setParent(null);
  }
  
  public function addConnection(source: Connector, destination: Connector): Connection
  {
    return null;  
  }
  public function removeConnection(connection: Connection): Void {}
}