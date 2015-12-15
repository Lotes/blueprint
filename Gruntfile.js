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
            core: {
                files: ['core/src/**/*.ts'],
                tasks: [
                    'typescript:core', 
                    'browserify:core',
                    'browserify:renderer'
                    //'browserify:rendererWorker'
                ]
            },
            diagrams: {
                files: ['**/*.puml'],
                tasks: ['run:diagrams']
            }
        },
        browserify: {
            core: {
                files: {
                    'core/dist/blueprint.js': ['core/intermediate/basics-rev2.js']
                }
            },
            renderer: {
                files: {
                    'core/dist/renderer.master.js': ['core/intermediate/renderer.master.js']
                }
            },
            rendererWorker: {
                files: {
                    'core/dist/renderer.worker.js': ['core/intermediate/renderer.worker.js']
                }
            }
        },
        typescript: {
            core: {
                src: ['core/src/**/*.ts'],
                dest: 'core/intermediate',
                options: {
                    module: 'commonjs',
                    target: 'es5', 
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        mochaTest: {
            core: {
                options: {
                    reporter: 'nyan',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['core/test/**/*.spec.js']
            }
        },
        run: {
            diagrams: {
                exec: 'cd uml && node generate.js',
            }
        },
        jshint: {
            core: {
                src: ['core/intermediate/**/*.js']
            }
        },
	    typedoc: {
		    core: {
			    options: {
				    module: 'commonjs',
				    out: './docs',
				    name: 'blueprint',
				    target: 'es5'
			    },
			    src: ['./core/src/**/*']
		    }
	    },
        yuidoc: {
            core: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'core/src',
                    outdir: 'docs/core/'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-php');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jison');
    grunt.loadNpmTasks('grunt-haxe');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-typedoc');
  
    // Default task(s).
    grunt.registerTask('default', ['haxe', 'less', 'coffee', 'php']);
    grunt.registerTask('test', ['mochaTest:core']);
    grunt.registerTask('style', ['jshint:core']);
};