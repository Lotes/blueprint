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
      save: function(name, data) {
        name = name || 'example';
        var url = 'data';
        url += '/'+name;
        return $http.post(url, data);
      }
    };
  });

