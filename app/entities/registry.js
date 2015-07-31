angular
  .module('blueprint')
  .factory('registry', function() {
    var nodes = {}; 
   
    function Node(name, definition) {    
      var self = this;
      if(!definition.markupUrl)
        throw new Error('No markup defined for node "'+name+'"!');            
      self.markupUrl = definition.markupUrl;      
    }
    
    return {    
      addNode: function(name, definition) {
        nodes[name] = new Node(name, definition);
      },
      getNode: function(name) {
        return nodes[name];
      },
    };
  });