package;

import computation.Worker;
import js.Error;

class WorkerMain extends computation.Worker
{  
  private function initialize(netData: Dynamic) {
    var x: computation.NetState = null; 
  }
  
  private function answerSuccess(id: Int, message: Dynamic) {
    postMessage({
      id: id,
      type: "success",
      body: message
    });
  }
  
  private function answerError(id: Int, error: String) {
    postMessage({
      id: id,
      type: "error",
      body: error
    });
  }
  
  private function notify(id: Int, message: Dynamic) {
    postMessage({
      id: id,
      type: "notify",
      body: message
    });
  }
  
  public override function onMessage(message: Dynamic) { 
    var id = message.id;
    var body = message.body;
    var action = body.action;
    switch(action) {
      case "initialize":
          try {
            initialize(body.data); 
            answerSuccess(id, null);
          } catch(err: Error) {
            answerError(id, err.message);
          }          
      case "cancel":
      case "step":
    }
  }
  
  public static function main(){
     computation.Worker.export(new WorkerMain());
  }
}