angular
  .module('blueprint', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/templates/page.html',
        controller: 'PageController'
      })
      .otherwise({ redirectTo: '/' });
  })
  .run(function() {
      
  })
  .service('TranslationService', function($http) {
    //TODO provided languages
    this.register = function(id, hash, callback) {};
    this.unregister = function(id) {};
    this.setLanguage = function(language) {};
  })
  .directive('translatable', function(TranslationService) {
    return {
      restrict: 'A',
      scope: {
        translatable: '@'
      },
      link: function($scope, element, attrs) {
        var content = element.html();
        var id = $scope.translatable;
        var hash = md5(content);
        
        TranslationService.register(id, hash, function(translation, upToDate) {
          if(typeof(translation) === 'string')
            element.html(translation);
          else
            element.html(content);
          //if(typeof(upToDate) === 'boolean') {}
        });
        
        $scope.$on('$destroy', function() {
          TranslationService.unregister(id);
        });
      }
    }
  })
  .controller('PageController', function($scope) {
  
  })
  ;
  
//var name = $routeParams.name;