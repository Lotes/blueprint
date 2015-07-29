angular
  .module('blueprint')
  .factory('registry', function() {
    var nodes = {}; 
    var connections = {}; 
   
    function Node(name, definition) {    
      var self = this;
      if(!definition.markupUrl)
        throw new Error('No markup defined for node "'+name+'"!');            
      self.markupUrl = definition.markupUrl;      
    }
    
    function Connection(definition) {    
      
    }
    
    return {    
      addNode: function(name, definition) {
        nodes[name] = new Node(name, definition);
      },
      addConnection: function(name, definition) {
        connections[name] = new Connection(definition);
      },
      getNode: function(name) {
        return nodes[name];
      },
      getConnection: function(name) {
        return connections[name];
      }
    };
  });