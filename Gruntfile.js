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
        watch: {
            diagrams: {
                files: ['**/*.puml'],
                tasks: ['run:diagrams']
            }
        },
        run: {
            diagrams: {
                exec: 'cd uml && node generate.js',
            }
        }
    });

    grunt.loadNpmTasks('grunt-php');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-haxe');
    grunt.loadNpmTasks('grunt-run');
  
    // Default task(s).
    grunt.registerTask('default', ['watch:diagrams']);
};