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

        // JSLint all the things!
        jslint: {
            server: {
                directives: {
                    // node environment
                    node: true,
                    // browser environment
                    browser: false,
                    // allow dangling underscores in var names
                    nomen: true,
                    // allow to do statements
                    todo: true,
                    // allow unused parameters
                    unparam: true,
                    // don't require use strict pragma
                    sloppy: true
                },
                files: {
                    src: [
                        '*.js',
                        'server/*.js'
                    ]
                }
            },
            client: {
                directives: {
                    // node environment
                    node: false,
                    // browser environment
                    browser: true,
                    // allow dangling underscores in var names
                    nomen: true,
                    // allow to do statements
                    todo: true,
                     // allow unused parameters
                    unparam: true
                },
                files: {
                    src: '<%= paths.app %>/**/*.js'
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
                src: ['core/test/unit/**/*_spec.js']
            },

            api: {
                src: ['core/test/unit/**/api*_spec.js']
            },

            client: {
                src: ['core/test/unit/**/client*_spec.js']
            },

            server: {
                src: ['core/test/unit/**/server*_spec.js']
            },

            shared: {
                src: ['core/test/unit/**/shared*_spec.js']
            },

            perm: {
                src: ['core/test/unit/**/permissions_spec.js']
            },

            migrate: {
                src: [
                    'core/test/unit/**/export_spec.js',
                    'core/test/unit/**/import_spec.js'
                ]
            }
        },

        less: {
            app: {
                options: {
                    paths: ["<%= paths.app %>/assets/less"]
                },
                files: {
                    '<%= paths.build %>/css/app.css': '<%= paths.app %>/assets/less/app.less'
                }
            }
        },

        handlebars: {
            compile: {
                options: {
                    namespace: "Nongo.Templates",
                    processName: function (filePath) {
                        return filePath.slice(filePath.lastIndexOf('/') + 1, -4);
                    }
                },
                files: {
                    "<%= paths.build %>/js/templates.js": "<%= paths.app %>/templates/*.hbs"
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
                        dest: 'dest/fonts',
                        filter: 'isFile',
                        src: [
                            '<%= paths.app %>/bower_components/bootstrap/dist/fonts',
                            '<%= paths.app %>/assets/fonts'
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
        }
    });

    grunt.registerTask('setTestEnv', function () {
        // Use 'testing' Ghost config; unless we are running on travis (then show queries for debugging)
        process.env.NODE_ENV = process.env.TRAVIS ? 'travis' : 'testing';
    });

    // grunt.registerTask("build", [
    //     "handlebars",
    //     "concat",
    //     "uglify",
    //     "clean:build",
    //     "copy:build",
    //     "compress:build"
    // ]);

    // grunt.registerTask('release', [
    //     'shell:bourbon',
    //     'sass:admin',
    //     'handlebars',
    //     'concat',
    //     'uglify',
    //     'changelog',
    //     'clean:build',
    //     'copy:build',
    //     'compress:release'
    // ]);

    // Dev Mode; watch files and restart server on changes
    grunt.registerTask("dev", [
        'less',
        'handlebars',
        'concat',
        'copy',
        'watch'
    ]);


    // Run unit tests
    grunt.registerTask('test-unit', ['setTestEnv', 'mochacli:all']);

    // Run casperjs tests only
    //grunt.registerTask('test-functional', ['clean:test', 'setTestEnv', 'express:test', 'spawn-casperjs']);

    // Run tests and lint code
    grunt.registerTask('validate', ['jslint', 'test-unit']);

    // TODO: Production build task that minifies with uglify:prod
    grunt.registerTask("prod", ['less', 'handlebars', 'concat', 'copy', "uglify"]);

    // When you just say "grunt"
    grunt.registerTask("default", ['less', 'handlebars', 'concat', 'copy']);
};
