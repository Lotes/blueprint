angular
  .module('blueprint')
  .factory('bpModuleRepository', function(Module, $q, $http, Node, 
      Position, Connection, Anchor, AnchorHandle, Neuron, ModuleInstance, ConnectionEndPoint) {
    
    function parseModule(res) {
      var deferred = $q.defer();
      var result = new Module(res.name);
      var promises = [];
      //add nodes
      var nodes = _.map(res.nodes, function(value, key) {
        var name = key;
        var parentModule = result;
        var position = new Position(value.position[0], value.position[1]);
        switch(value.type) {
          case 'neuron-activate':
            var node = new Neuron(name, 'activate');
            node.parentModule = parentModule;
            node.position = position;
            return node;  
          case 'neuron-inhibit':
            var node = new Neuron(name, 'inhibit');
            node.parentModule = parentModule;
            node.position = position;
            return node;  
          case 'neuron-associate':
            var node = new Neuron(name, 'associate');
            node.parentModule = parentModule;
            node.position = position;
            return node;  
          case 'neuron-disassociate':
            var node = new Neuron(name, 'disassociate');
            node.parentModule = parentModule;
            node.position = position;
            return node;  
          case 'module-instance':
            var instance = new ModuleInstance(name);
            instance.parentModule = parentModule;
            instance.position = position;
            var promise = repository.get(value.moduleName);
            promises.push(promise);
            promise
              .then(function(module) { instance.module = module; },
                    function(err) {  });
            return instance;
          default:
            throw new Error('Unknown node type: '+value.type);
        }
      });
      //add connections
      var connections = _.map(res.connections, function(value) {
        var connection = new Connection();
        connection.parentModule = result;
        connection.source = new ConnectionEndPoint(value.source.node, value.source.connector);
        connection.destination = new ConnectionEndPoint(value.destination.node, value.destination.connector);
        connection.anchors = _.map(value.anchors, function(anchor) {
          var anchorObj = new Anchor(anchor.position[0], anchor.position[1]);
          anchorObj.parentConnection = connection;
          anchorObj.inHandle = new AnchorHandle(anchor['in'].position[0], anchor['in'].position[1]),
          anchorObj.outHandle = new AnchorHandle(anchor['out'].position[0], anchor['out'].position[1])
          return anchorObj;
        });
        return connection;
      });
      result.nodes = nodes;
      result.connections = connections;
      if(promises.length == 0)
        deferred.resolve(result);
      else
        $q.all(promises)
          .then(
            function() { deferred.resolve(result); }, 
            function(err) { deferred.reject(err); }
          );
      return deferred.promise;
    }
    
    var modules = {};
    var promises = {};
    
    var repository = {
      get: function(name) {
        //already exists
        if(name in modules) {
          var deferred = $q.defer();  
          deferred.resolve(modules[name]);
          return deferred.promise;
        }
        //already requested
        if(name in promises)
          return promises[name];
        //requested it now
        var deferred = $q.defer();        
        var promise = deferred.promise;
        promises[name] = promise;
        $http.get('/data/'+name)
          .then(function(response) {
            parseModule(response.data)
              .then(function(module) {
                modules[name] = module;
                delete promises[name];
                deferred.resolve(module);         
              }, function(err) { deferred.reject(new Error('Could not parse module "'+name+'"!')); });
          }, function(response) {
            deferred.reject(new Error('Could not load module "'+name+'"!'));
          });
        return promise;
      }
    };
    
    return repository;
  });

