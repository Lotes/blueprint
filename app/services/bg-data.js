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
        var url = 'data';
        if(name)
          url += '/'+name;
        return $http.post(url, data);
      }
    };
  });

