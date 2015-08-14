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
    
    //fetch module
    $scope.data = null;
    $scope.ready = false;
    bpModuleRepository
      .get('example')
      .then(function(module) { $scope.data = module; $scope.ready = true; },
            function(err) { alert(err.message); });
  });