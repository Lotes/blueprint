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
	  //name: "system.IfThenElse" --> Location: /system/IfThenElse.json
    //named nodes als Property
      //condition: Neuron
      //flowControl: Neuron
      //thenBranch: Neuron
      //elseBranch: Neuron
    //Parameter als Property
      //decayConstant: RealPositive = 0.005
      //learningConstant: RealPositive = 0.0001
    //Parameter <--> ChildrenNodes <--> Property
      //lieber Module.Parameters.ParameterName
      //oder Module.Nodes.NodeName
      //oder Module.PropertyName
  }
  
}