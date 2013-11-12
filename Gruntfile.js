var path           = require('path'),
    buildDirectory = path.resolve(process.cwd(), '.build'),
    distDirectory  = path.resolve(process.cwd(), '.dist');


module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Common paths to be used by tasks
        paths: {
            app: 'client',
            build: 'public'
        },
        buildType: 'Build',
        pkg: grunt.file.readJSON('package.json'),

        // Watch files and livereload in the browser during development
        watch: {
            handlebars: {
                files: ['<%= paths.app %>/templates/*.hbs'],
                tasks: ['handlebars']
            },
            less: {
                files: ['<%= paths.app %>/assets/less/*.less'],
                tasks: ['less']
            },
            concat: {
                files: [
                    '<%= paths.app %>/*.js',
                    '<%= paths.app %>/models/*.js',
                    '<%= paths.app %>/views/*.js'
                ],
                tasks: ['concat']
            }
        },

        // JSHint all the things!
        jshint: {
            options: {
                esnext: true,
                bitwise: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                quotmark: 'single',
                undef: true,
                trailing: true,
                smarttabs: true,
                proto: true
            },
            server: {
                options: {
                    node: true,
                    browser: false,
                    proto: true,
                    globals: {
                        describe: true,
                        it: true,
                        before: true,
                        beforeEach: true,
                        after: true,
                        afterEach: true,
                        should: true
                    }
                },
                files: {
                    src: [
                        '*.js',
                        'server/**/**/*.js',
                        'tests/unit/**/*.js'
                    ]
                }
            },




            client: {
                options: {
                    // node environment
                    node: false,
                    // browser environment
                    browser: true
                },
                files: {
                    src: ['<%= paths.app %>/**/*.js', '!<%= paths.app %>/bower_components/**']
                },
                exclude: [
                    '<%= paths.app %>/assets/**/*.js',
                    '<%= paths.app %>/bower_components/**/*.js',
                    '<%= paths.app %>/templates/*.js'
                ]
            }
        },


        mochacli: {
            options: {
                ui: 'bdd',
                reporter: 'spec',
                timeout: '15000'
            },

            all: {
                src: ['tests/unit/**/*_spec.js']
            },

            api: {
                src: ['tests/unit/**/api*_spec.js']
            }
        },

        less: {
            app: {
                options: {
                    paths: ['<%= paths.app %>/assets/less']
                },
                files: {
                    '<%= paths.build %>/css/app.css': '<%= paths.app %>/assets/less/app.less'
                }
            }
        },

        handlebars: {
            compile: {
                options: {
                    namespace: 'Nongo.Templates',
                    processName: function (filePath) {
                        return filePath.slice(filePath.lastIndexOf('/') + 1, -4);
                    }
                },
                files: {
                    '<%= paths.build %>/js/templates.js': '<%= paths.app %>/templates/*.hbs'
                }
            }
        },

        clean: {
            build: {
                src: ['<%= paths.build %>/**']
            }
        },

        concat: {
            dev: {
                files: {
                    '<%= paths.build %>/css/lib.css': [
                        '<%= paths.app %>/bower_components/bootstrap/dist/css/bootstrap.css'
                    ],

                    '<%= paths.build %>/js/lib.js': [
                        '<%= paths.app %>/bower_components/jquery/jquery.js',
                        '<%= paths.app %>/bower_components/underscore/underscore.js',
                        '<%= paths.app %>/bower_components/backbone/backbone.js',
                        '<%= paths.app %>/bower_components/marionette/lib/backbone.marionette.js',
                        '<%= paths.app %>/bower_components/handlebars/handlebars.js',
                        '<%= paths.app %>/bower_components/bootstrap/dist/js/bootstrap.js'
                    ],

                    '<%= paths.build %>/js/models.js': [
                        '<%= paths.app %>/models/**/*.js'
                    ],

                    '<%= paths.build %>/js/views.js': [
                        '<%= paths.app %>/views/**/*.js',
                    ],

                    '<%= paths.build %>/js/app.js': [
                        '<%= paths.app %>/*.js'
                    ]
                }
            },
            prod: {}
        },

        copy: {
            dev: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: '<%= paths.app %>/bower_components/bootstrap/dist/fonts',
                        dest: '<%= paths.build %>/fonts/',
                        filter: 'isFile',
                        src: [
                            '*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.app %>/assets/fonts',
                        dest: '<%= paths.build %>/fonts/',
                        filter: 'isFile',
                        src: [
                            '*'
                        ]
                    }
                ]
            },
        },

        uglify: {
            prod: {
                files: {
                    '<%= config.build %>/js/nongo.min.js': '<%= config.build %>/js/nongo.js'
                }
            }
        },

        mochacov: {
            travis: {
                options: {
                    coveralls: {
                        serviceName: 'travis-ci'
                    }
                }
            },
            html:{
                options: {
                    reporter: 'html-cov',
                    output: 'cov.html'
                }
            },
            options: {
                files: 'tests/unit/*.js',
                timeout: 5000,
                require: ['should']
            }

        }
    });

    grunt.registerTask('setTestEnv', function () {
        //process.env.NODE_ENV = process.env.TRAVIS ? 'travis' : 'testing';
        process.env.NODE_ENV = 'testing';
    });

    // Dev Mode; watch files and restart server on changes
    grunt.registerTask('dev', [
        'less',
        'handlebars',
        'concat',
        'copy',
        'watch'
    ]);


    // Run unit tests

    if(process.env.TRAVIS){
        grunt.registerTask('validate', ['jshint', 'test', 'cov-travis']);
    }else{
        grunt.registerTask('validate', ['jshint', 'test', 'mochacov:travis']);
    }

    grunt.registerTask('test', ['setTestEnv', 'mochacli:all']);

    // Generate code coverage
    grunt.registerTask('cov', ['setTestEnv', 'mochacov:html']);
    
    grunt.registerTask('validate', ['jshint', 'test']);

    grunt.registerTask('prod', ['less', 'handlebars', 'concat', 'copy', 'uglify']);

    // When you just say "grunt"
    grunt.registerTask('default', ['less', 'handlebars', 'concat', 'copy']);
};
