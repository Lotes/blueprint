angular
  .module('blueprint', ['ngRoute'])
  .config(function($routeProvider) {
    var options = {
      templateUrl: 'templates/main.html',
      controller: 'bpMainController'
    };
    $routeProvider.
      when('/', options).
      when('/:name', options).
      when('/:name/:revision', options).
      otherwise({ redirectTo: '/' });
  })
  .run(function ($templateCache, $http) {
      //HACK: preload directive templates such that the connector are built before connections
      $http.get('app/directives/bp-neuron.template.xml', { cache: $templateCache });
  });