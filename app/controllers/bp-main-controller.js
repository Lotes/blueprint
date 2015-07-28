angular
  .module('blueprint')
  .controller('bpMainController', function($scope, bpData, $routeParams, $location) {
    var name = $routeParams.name;
    var revision = $routeParams.revision;
    $scope.data = null;
    bpData.load(name, revision)
      .then(function(res) {
        $scope.data = res.data;
      }, function() {
        if(revision) {
          alert('No revision '+revision+' for blueprint "'+name+'"!');
          $location.path('/'+name); 
        } else if(name) {
          alert('No blueprint "'+name+'"!');
          $location.path('/');
        } else
          $location.path('/');
      });
  });