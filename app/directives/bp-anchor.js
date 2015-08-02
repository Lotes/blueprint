angular
  .module('blueprint')
  .directive('bpAnchor', function(registry, bpEditor) {
    return {
      templateNamespace: 'svg',
      restrict: 'E',
      replace: true,
      require: '^bpCanvas',
      scope: {
        data: '=anchor',
      },
      templateUrl: 'app/directives/bp-anchor.template.xml'
    };
  });