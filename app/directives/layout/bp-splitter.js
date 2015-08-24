angular
  .module('blueprint')
  .directive('bpSplitter', function() {
    return {
      restrict: 'E',
      require: ['^bpLayout', 'bpSplitter'],
      replace: true,
      scope: {
        size: '@size'  
      },
      templateUrl: 'app/directives/layout/bp-splitter.template.html',
      controller: function($scope, $element) {},
      link: function($scope, $element, $attrs, controllers) {}
    };
  });