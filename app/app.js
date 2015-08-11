angular
  .module('blueprint', ['ngRoute', 'ngBackbone'])
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
  });