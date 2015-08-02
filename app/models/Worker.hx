package;

class Worker {
  public function new() {}
	public function onMessage(message : Dynamic) : Void { }
  public function postMessage(message : Dynamic) : Void {
    untyped __js__("self.postMessage(JSON.stringify(message))");
  }
  public static function export( script : Worker ) {
    untyped __js__("self.onmessage = function(e) { script.onMessage(JSON.parse(e.data)); };");
  } 
}