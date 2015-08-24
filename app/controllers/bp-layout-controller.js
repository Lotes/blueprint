angular
  .module('blueprint')
  .controller('bpLayoutController', function($scope) {
    $scope.width = 0;
    $scope.height = 0;
    $scope.canvasResized = function(w, h) {
      $scope.width = w;
      $scope.height = h;  
    };
  });