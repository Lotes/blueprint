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
                    "app/modules/editor/styles/editor.css": "app/modules/editor/styles/editor.less"
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
        jison: {
            parser: {
                options: {
                    moduleType: 'js',
                    moduleName: 'parser'
                },
                files: { 'app/modules/compiler/parser.generated.js': 'app/modules/compiler/parser.jison' }
            }
        },
        watch: {
            web: {
                files: ['app/modules/**/*.hx', 'app/modules/**/*.less', 'app/modules/**/*.coffee', 'app/modules/**/*.jison'],
                tasks: [ 'haxe:worker', 'less:svg', 'coffee:editor', 'jison:parser' ],
                options: {
                    livereload: true
                }
            },
            core: {
                files: ['core/src/**/*.ts'],
                tasks: ['typescript:core', 'browserify:core'
                //, 'jshint:core', 'mochaTest:core'
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
                    /*'core/dist/blueprint.js': [
                        'core/intermediate/basics-rev2.js',
                        'core/intermediate/renderer.master.js'
                    ],*/
                    'core/dist/renderer.master.js': [
                        'core/intermediate/renderer.master.js'
                    ],
                    'core/dist/renderer.worker.js': [
                        'core/intermediate/renderer.worker.js'    
                    ]
                },
                options: {
                    require: ['./core/intermediate/renderer.master']
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
  
    // Default task(s).
    grunt.registerTask('default', ['haxe', 'less', 'coffee', 'php']);
    grunt.registerTask('test', ['mochaTest:core']);
    grunt.registerTask('style', ['jshint:core']);
};