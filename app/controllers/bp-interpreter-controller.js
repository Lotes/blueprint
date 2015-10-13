angular
	.module('blueprint')
	.controller('bpInterpreterController', function($scope) {
		$scope.result = 0;
		$scope.script = 'ActivatorNeuron act { maximum: 1 };';
		$scope.$watch('script', function() {
			try {
				$scope.result = parser.parse($scope.script);
			} catch(ex) { $scope.result = 'Error: ' + ex.message; }
		});
	});