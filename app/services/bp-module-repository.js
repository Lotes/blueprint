angular
  .module('blueprint')
  .factory('bpModuleRepository', function(Module, $q, $http, NodeCollection, ConnectionCollection, Node, 
      Position, Connection, Anchor, AnchorCollection, Neuron, ModuleInstance, ConnectionEndPoint) {
    
    function parseModule(res) {
      var deferred = $q.defer();
      var result = new Module({ id: res.name });
      var description = res.description || "";
      var promises = [];
      var nodes = new NodeCollection(_.map(res.nodes, function(value, key) {
        var attributes = {
          id: key,
          parentModule: result,
          position: new Position({ 
            x: value.position[0],
            y: value.position[1]
          })
        };
        switch(value.type) {
          case 'neuron-activate':
            attributes.type = 'activate';
            return new Neuron(attributes);  
          case 'neuron-inhibit':
            attributes.type = 'inhibit';
            return new Neuron(attributes);  
          case 'neuron-associate':
            attributes.type = 'associate';
            return new Neuron(attributes);  
          case 'neuron-disassociate':
            attributes.type = 'disassociate';
            return new Neuron(attributes);  
          case 'module-instance':
            var instance = new ModuleInstance(attributes);
            var promise = repository.get(value.moduleName);
            promises.push(promise);
            promise
              .then(function(module) { instance.set({ module: module }); },
                    function(err) {  });
            return instance;
          default:
            throw new Error('Unknown node type: '+value.type);
        }
      }));
      var connections = _.map(res.connections, function(value) {
        var connection = new Connection({
          parentModule: self,
          source: new ConnectionEndPoint({
            path: value.source.node,
            connector: value.source.connector
          }),
          destination: new ConnectionEndPoint({
            path: value.destination.node,
            connector: value.destination.connector
          })
        });
        var anchors = _.map(value.anchors, function(anchor) {
          return new Anchor({
            parentConnection: connection,
            position: new Position({ x: anchor.position[0], y: anchor.position[1] }),
            inHandle: new Position({ x: anchor['in'].position[0], y: anchor['in'].position[1] }),
            outHandle: new Position({ x: anchor['out'].position[0], y: anchor['out'].position[1] })
          });
        });
        connection.set({ anchors: new AnchorCollection(anchors) });
        return connection;
      });
      result.set({
        description: description,
        nodes: nodes,
        connections: new ConnectionCollection(connections)
      });
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

