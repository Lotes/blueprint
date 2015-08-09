package editor;

class Helpers
{
  public static function isIdentifier(str: String) 
  {
    var regex = new EReg("^[a-zA-Z_][a-zA-Z0-9_]*$", "");
    return regex.match(str);
  }
  public static function isNamespacedIdentifier(str: String) 
  {
    var regex = new EReg("^[a-zA-Z_][a-zA-Z0-9_]*(\\.[a-zA-Z_][a-zA-Z0-9_]*)?$", "");
    return regex.match(str);
  }
  private function new() {}
    
}