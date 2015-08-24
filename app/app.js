angular
  .module('blueprint', ['ngRoute'])
  .config(function($routeProvider) {
    var options = {
      templateUrl: 'templates/main.html',
      controller: 'bpMainController'
    };
    $routeProvider
      .when('/', options)
      .when('/layout', { 
        templateUrl: 'templates/layout.html',
        controller: 'bpLayoutController'
      })
      .when('/:name', options)
      .otherwise({ redirectTo: '/' });
  })
  .run(function ($templateCache, $http) {
      //HACK: preload directive templates such that the connector are built before connections
      $http.get('app/directives/editor/bp-neuron.template.xml', { cache: $templateCache });
  });