angular
  .module('blueprint')
  .controller('bpMainController', function($scope, bpData, $routeParams, $location) {
    var name = $routeParams.name;
    var revision = $routeParams.revision;
    $scope.mode = 'edit';
    $scope.selection = null;
    $scope.data = null;
    $scope.snapToGrid = true;
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