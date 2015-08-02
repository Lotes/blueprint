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
    },
    haxe: {
        model: {
            main: 'Main',
            classpath:['app/models'],
            output:'app/models/model.js'
        }
    },
    watch: {
      files: 'app/models/**/*.hx',
      tasks: [ 'haxe:model' ]
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-haxe');

  // Default task(s).
  grunt.registerTask('default', ['haxe:model', 'php']);

};