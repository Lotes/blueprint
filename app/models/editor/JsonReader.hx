package editor;
import haxe.Json;

@:expose("blueprint.editor.JsonReader")
class JsonReader
{
  public function new() {}
  public function read(input: Dynamic) 
  {
    var data: {
      name: String,
      nodes: Dynamic,
      connections: Array<Dynamic>
    } = input;
    var result = new Module();
    result.setName(data.name);
    for (nodeId in Reflect.fields(data.nodes))
    {
      var nodeData = Reflect.field(data.nodes, nodeId);  
      var id = Std.parseInt(nodeId);
      
    }
    return result;
  } 
}