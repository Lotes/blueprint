declare function require(name:string): any;
(function() {
    'use strict';
    var Viz = require('viz.js');
    self.addEventListener('message', function(e) {
      var graphScript = e.data;
      var message: any = {};
      try {
          var plainScript = Viz(graphScript, { 
              engine: 'dot',
              format: 'xdot'
          });
          message.success = true; 
          message.result = plainScript;
      } catch(err) {
          message.success = false; 
          message.error = err.message;
      }
      (<any>self).postMessage(JSON.stringify(message));
    }, false);
})();