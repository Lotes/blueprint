angular
  .module('blueprint')
  .controller('bpMainController', function($scope, bpData, $routeParams, $location, bpEditor, bpNet, $templateCache, $http, $q) {    
    //HACK: preload entity templates such that the connector are built before connections
    var templates = ['app/entities/neuron.template.xml', 'app/entities/quad.template.xml'];
    for(var index=0; index<templates.length; index++)
      templates[index] = $http.get(templates[index], { cache: $templateCache });
    $scope.ready = false;
    $q.all(templates).then(function() { $scope.ready = true; }, function() { alert('Unable to load templates!'); });    
    
    //toolsbar
    var name = $routeParams.name;
    $scope.modes = bpEditor.modes;
    $scope.tools = {
      mode: 'select',
      snapToGrid: true,
      selection: null
    };
    
    //data
    $scope.data = null;
    $scope.saving = false;
    $scope.save = function() {
      if($scope.data != null) {
        $scope.saving = true;
        bpData
          .save(JSON.stringify($scope.data, null, 2))
          .success(function(res) {
            $scope.saving = false;
            $location.path('/'+res.name); 
          })
          .error(function() { 
            alert("Error while saving!"); 
            $scope.saving = false;
          }); 
      }
    };
    bpData.load(name)
      .then(function(res) {
        $scope.data = res.data;
      }, function() {
        if(name) {
          console.log('No blueprint "'+name+'"! Redirect to "/".');
          $location.path('/');
        } else
          $location.path('/');
      });
  });