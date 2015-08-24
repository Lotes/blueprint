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
        worker: {
            main: 'WorkerMain',
            classpath:['app/models'],
            output:'app/models/worker.js'
        }
    },
    less: {
      svg: {
        files: {
          "svg.css": "svg.less"
        }
      }
    },
    coffee: {
      editor: {
        files: {
          'app/services/editor.js': 'app/services/editor.coffee',
          'app/services/property-grid.js': 'app/services/property-grid.coffee'
        }
      }
    },
    watch: {
      files: ['app/models/**/*.hx', 'svg.less', 'app/services/**/*.coffee'],
      tasks: [ 'haxe:worker', 'less:svg', 'coffee:editor' ]
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-haxe');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  
  // Default task(s).
  grunt.registerTask('default', ['haxe', 'less', 'coffee', 'php']);
};