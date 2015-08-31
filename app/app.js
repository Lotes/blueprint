angular
  .module('blueprint', ['ngRoute', 'ngSanitize'])
  .config(function($routeProvider) {
    var options = {
      templateUrl: 'app/templates/main.html',
      controller: 'bpMainController'
    };
    $routeProvider
      .when('/', options)
      .when('/property-grid', { 
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
      var templates = ['bp-anchor.template.xml', 'bp-connectable-node.template.xml', 
        'bp-editor.template.xml', 'bp-module-instance.template.xml',
        'bp-neuron.template.xml'];
      _.each(templates, function(template) {
        $http.get('app/modules/editor/templates/'+template, { cache: $templateCache });
      });
      $http.get('app/modules/layout/templates/bp-splitter.template.html', { cache: $templateCache });
  });