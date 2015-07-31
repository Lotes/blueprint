angular
  .module('blueprint')
  .controller('bpMainController', function($scope, bpData, $routeParams, $location) {
    var name = $routeParams.name;
    var revision = $routeParams.revision;
    $scope.mode = 'edit';
    $scope.selection = null;
    $scope.data = null;
    $scope.snapToGrid = true;
    $scope.save = function() {
      if($scope.data != null) {
        $scope.saving = true;
        bpData
          .save(name, JSON.stringify($scope.data, null, 2))
          .success(function(res) {
            $scope.saving = false;
          })
          .error(function() { 
            alert("Error while saving!"); 
            $scope.saving = false;
          }); 
      }
    };
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