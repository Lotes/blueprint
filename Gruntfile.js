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
            classpath:['app/modules/editor/models'],
            output:'app/modules/editor/models/worker.js'
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
          'app/modules/editor/services/editor.js': 'app/modules/editor/services/editor.coffee',
          'app/modules/property-grid/services/property-grid.js': 'app/modules/property-grid/services/property-grid.coffee'
        }
      }
    },
    watch: {
      files: ['app/modules/**/*.hx', 'svg.less', 'app/modules/**/*.coffee'],
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