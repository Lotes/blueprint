package editor;

class Position extends PropertiesObject
{
  public function new(x: Int, y: Int) 
  {
    super();
    addProperty(
      "x",
      function(data) { data.set("x", x); },
      function(data) { data.remove("x"); },
      function(data) { return cast(data.get("x"), Int); },
      function(data, value) { data.set("x", value); }
    );
    addProperty(
      "y",
      function(data) { data.set("y", x); },
      function(data) { data.remove("y"); },
      function(data) { return cast(data.get("y"), Int); },
      function(data, value) { data.set("y", value); }
    );
  }
  
  public function getX(): Int { return getPropertyValue("x"); }
  public function setX(value: Int): Void { setPropertyValue("x", value); }
  public function getY(): Int { return getPropertyValue("y"); }
  public function setY(value: Int): Void { setPropertyValue("y", value); }
  
  public static function add(a: Position, b: Position) {
    return new Position(a.getX()+b.getX(), a.getY()+b.getY());  
  }
  
}