angular
  .module('blueprint')
  .controller('bpMainController', function($scope, bpModuleRepository, $routeParams, $location, bpEditorData, bpNet, $templateCache, $http, $q, Module) {
    //toolsbar
    var name = $routeParams.name;
    $scope.modes = bpEditorData.modes;
    $scope.tools = {
      mode: 'select',
      snapToGrid: true,
      selection: null
    };
    
    //size
    $scope.width = 0;
    $scope.height = 0;
    $scope.canvasResized = function(w, h) {
      $scope.width = w;
      $scope.height = h;  
    };
    
    //fetch module
    $scope.data = null;
    $scope.ready = false;
    bpModuleRepository
      .get('example')
      .then(function(module) { $scope.data = module; $scope.ready = true; },
            function(err) { alert(err.message); });
            
    //save module
    $scope.saving = false;
    $scope.save = function() {
      if(!$scope.data)
        return;
      saving = true;
      bpModuleRepository
        .save($scope.data)
        .then(function(res) { alert('saved as "'+res.data.name+'"'); $scope.saving = false; },
              function(err) { alert(err.message); $scope.saving = false; });
    };
  });