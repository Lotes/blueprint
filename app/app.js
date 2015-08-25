angular
  .module('blueprint', ['ngRoute'])
  .config(function($routeProvider) {
    var options = {
      templateUrl: 'app/templates/main.html',
      controller: 'bpMainController'
    };
    $routeProvider
      .when('/', options)
      .when('/properties', { 
        templateUrl: 'app/templates/property-grid.html',
        controller: 'bpPropertyGridController'
      })
      .when('/layout', { 
        templateUrl: 'app/templates/layout.html',
        controller: 'bpLayoutController'
      })
      .when('/:name', options)
      .otherwise({ redirectTo: '/' });
  })
  .run(function ($templateCache, $http) {
      //HACK: preload directive templates such that the connector are built before connections
      $http.get('app/modules/editor/templates/bp-neuron.template.xml', { cache: $templateCache });
      $http.get('app/modules/layout/templates/bp-splitter.template.html', { cache: $templateCache });
  });