angular
  .module('blueprint')
  .factory('bpNet', function($http, $q) {
    var ID = 0;
    var worker = new Worker('app/models/model.js');    
    var listeners = {};
    function send(message) {
      var id = ID++;
      var deferred  = $q.defer();
      listeners[id] = deferred;
      worker.postMessage(JSON.stringify({
        id: id,
        body: message
      }));
      return deferred.promise;
    }
    worker.addEventListener('message', function(e) {
      var message = JSON.parse(e.data);
      var id = message.id;
      var body = message.body;
      var deferred = listeners[id];
      if(!deferred)
        return;
      switch(message.type) {
        case 'success':
          deferred.resolve(body);
          delete listeners[id];
          break;
        case 'error':
          deferred.reject(body);
          delete listeners[id];
          break;
        case 'notify':
          deferred.notify(body);
          break;
      }
    }, false);
    return {
      cancel: function() { 
        return send({ 
          action: 'cancel'
        }); 
      },
      initialize: function(data) {        
        return send({ 
          action: 'initialize',
          data: data
        }); 
      },
      step: function() {
        return send({ 
          action: 'step'
        }); 
      }
    };
  });

