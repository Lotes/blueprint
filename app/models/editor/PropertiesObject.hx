package editor;

class PropertiesObject
{
  private var properties = new Map<String,Property>();
  private var data = new Map<String, Dynamic>();
  private var changedHandlers = new Map < String, Array <Void->Void >> ();
	
  public function new() { }

  public function onPropertyChanged(name: String, handler: Void->Void): Void
  {
    if (!hasProperty(name))
      return;
    changedHandlers.get(name).push(handler);
  }
  
  public function offPropertyChanged(name: String, handler: Void->Void): Void
  {
    if (!hasProperty(name))
      return;
    changedHandlers.get(name).remove(handler);
  }
  
  private function triggerPropertyChanged(name: String): Void 
  {
    if (!hasProperty(name))
      return;
    for (handler in changedHandlers.get(name))
      handler();
  }
  
  public function getPropertyNames(): Array<String> 
  { 
    var result = new Array<String>();
    var keys = properties.keys();
    while (keys.hasNext())
      result.push(keys.next());
    return result;
  }
  
  public function hasProperty(name: String): Bool { return properties.exists(name); }
  
  private function addProperty<T>(
    name: String,
    init: (Map<String,Dynamic> -> Void), 
    fini: (Map<String,Dynamic> -> Void),
    get: (Map<String,Dynamic> -> T), 
    set: (Map<String,Dynamic> -> T -> Void) = null
  ): Void 
  {
    var property = new Property(name, init, fini, get, set);
    properties.set(name, property); 
    changedHandlers.set(name, new Array<Void->Void>());
    property.initialize(data); 
  }
  private function removeProperty(name: String): Void 
  {
    var property = getProperty(name); 
    property.finalize(data);
    properties.remove(name);
    changedHandlers.remove(name);
  }
  private function getProperty(name: String): Property { return properties.get(name); }
  public function getPropertyValue(name: String): Dynamic { return getProperty(name).getValue(data); }
  public function setPropertyValue(name: String, value: Dynamic): Void 
  { 
    getProperty(name).setValue(data, value); 
    triggerPropertyChanged(name);
  }
  public function isPropertyReadable(name: String): Bool { return getProperty(name).isReadable(); }
  public function isPropertyWriteable(name: String): Bool { return getProperty(name).isWriteable(); }
}