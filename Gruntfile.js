module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    php: {
      dist: {
        options: {
          port: 5000,
          keepalive: true,
          open: true
        }
      }
    }    
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-php');

  // Default task(s).
  grunt.registerTask('default', ['php']);

};