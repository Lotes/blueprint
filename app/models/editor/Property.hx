package editor;
import js.Error;

class Property
{
  private var name: String;
  private var init: (Map<String,Dynamic> -> Void);
  private var fini: (Map<String,Dynamic> -> Void);
  private var get: (Map<String,Dynamic> -> Dynamic);
  private var set: (Map<String,Dynamic> -> Dynamic -> Void);
  
	public function new(name: String,
    init: (Map<String,Dynamic> -> Void),
    fini: (Map<String,Dynamic> -> Void),
    get: (Map<String,Dynamic> -> Dynamic), 
    set: (Map<String,Dynamic> -> Dynamic -> Void))
	{
    this.name = name;
    this.init = init;
    this.fini = fini;
    this.get = get;
    this.set = set;
	}
	
  public function getName() { return this.name; }
  public function initialize(data: Map<String,Dynamic>): Void { this.init(data); }
  public function finalize(data: Map<String,Dynamic>): Void { this.fini(data); }
  public function getValue(data: Map<String,Dynamic>): Dynamic 
  {
    if (!isReadable()) 
      throw new Error("Property '"+name+"' is not readable!");
    return get(data); 
  }
  public function setValue(data: Map<String,Dynamic>, value: Dynamic): Void 
  { 
    if (!isWriteable()) 
      throw new Error("Property '"+name+"' is not writeable!");
    set(data, value); 
  }
  public function isReadable() { return get != null; }
  public function isWriteable() { return set != null; }
}