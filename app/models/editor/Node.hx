package editor;

class Node extends PropertiesObject
{
  private var parent: Module;
  
  public function new() 
  {
    super();
    //position: [x,y]
    //name (unique)
  }
  
  public function getParent() { return parent; }
  public function setParent(module: Module) { parent = module; }
}