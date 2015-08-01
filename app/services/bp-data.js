angular
  .module('blueprint')
  .factory('bpData', function($http) {
    return {
      load: function(name, revision) {
        name = name || 'example';
        var url = 'data/'+name;
        if(revision)
          url += '/' + revision;
        return $http.get(url);
      },
      save: function( data) {
        return $http.post('data', data);
      }
    };
  });

