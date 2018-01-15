module.exports = function (grunt) {
    'use strict';
    var fs = require('fs');

    var karmaFiles = grunt.file.readJSON('.grunt/karmaFiles.json');
    karmaFiles.push(getWatchFiles());

    var jsBeautifyFiles = ['tests/js/unit/**/*.js'];

    var options = {};
    if (grunt.file.exists('./GruntOptions.json')) {
        options = grunt.file.readJSON('./GruntOptions.json');
    }
    var karmaBrowser = grunt.option('browser') || options.browser || 'Chrome';

    /** @namespace grunt.initConfig */
    grunt.initConfig({
        watch: {
            sass: {
                files: 'app/src/**/*.scss',
                tasks: ['sass']
            },
            scsslint: {
                files: 'app/src/**/*.scss',
                tasks: ['scsslint']
            },
            jshint: {
                files: ['test/**/*.js'],
                tasks: ['jshint']
            },
            karma: {
                files: getActiveFiles(),
                tasks: ['karma:auto:run'] //NOTE the :run flag
            },
            jsbeautify: {
                files: jsBeautifyFiles,
                tasks: ['jsbeautifier:write']
            }
        },
        karma: {
            options: {
                // Can use --browser=Chrome or 'browser': 'Chrome' in your GruntOptions.json to set this variable
                browsers: [karmaBrowser],
                singleRun: true,
                configFile: 'tests/js/unit/karma.conf.js',
                reporters: ['progress', 'coverage'],
                files: karmaFiles
            },
            src: {},
            auto: {
                browsers: ['Chrome'],
                singleRun: false,
                background: true
            },
        },
        jshint: {
            options: {
                ignores: ['src/**/*Generated.js', 'test/e2e/**/*', 'src/shared/charts/*', 'build/**/*.js'],
                unused: true,
                curly: true,
                eqeqeq: true,
                es3: true,
                maxcomplexity: 14,
                maxdepth: 3,
                noarg: true,
                nonbsp: true,
                nonew: true
            },
            all: ['test/**/*.js']
        },

        exec: {
            npm: 'npm install --no-bin-links',
            bowerInstall: 'bower install --allow-root',
            bowerUpdate: 'bower update --allow-root',
            buildBootstrap: 'cd dependencies/bootstrap; grunt dist;'//,
            //tsdInstall: 'npm run tsdInstall; chmod +x .'
        },

        clean: {
            dependencies: ['dependencies'],
            build: ['app/build'],
            test: ['build/test'],
        },

        sass: {
            options: {
                unixNewlines: true
            },
            mini: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'app/build/brickslopes.min.css': 'app/src/css/brickslopes.scss'
                }
            },
            compact: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'app/build/brickslopes.css': 'app/src/css/brickslopes.scss'
                }
            }
        },

        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        scsslint: {
            allFiles: [
                'src/**/*.scss'
            ],
            options: {
                config: '.scss-lint.yml',
                colorizeOutput: true
            }
        },

        jsbeautifier: {
            verify: {
                src: jsBeautifyFiles,
                options: {
                    config: '.jsbeautifyrc',
                    mode: 'VERIFY_ONLY'
                }
            },
            write: {
                src: jsBeautifyFiles,
                options: {
                    config: '.jsbeautifyrc',
                    mode: 'VERIFY_AND_WRITE'
                }
            }
        },

        copy: {
            index: {
                nonull: true,
                src: 'app/src/index-production.html',
                dest: 'app/index.html'
            },
            bootstrap: {
                files: [{
                    src: 'app/src/css/variables.less',
                    dest: 'dependencies/bootstrap/less/variables.less'
                }]
            },
            dependencies: {
                files: [{
                    src: 'dependencies/angular/angular.min.js',
                    dest: 'app/lib/angular.min.js'
                }, {
                    src: 'dependencies/angular-animate/angular-animate.min.js',
                    dest: 'app/lib/angular-animate.min.js'
                }, {
                    src: 'dependencies/angular-resource/angular-resource.min.js',
                    dest: 'app/lib/angular-resource.min.js'
                }, {
                    src: 'dependencies/angular-route/angular-route.min.js',
                    dest: 'app/lib/angular-route.min.js'
                }, {
                    src: 'dependencies/angular-route/angular-mocks.min.js',
                    dest: 'tests/js/lib/angular-mocks.min.js'
                }, {
                    src: 'dependencies/jquery/dist/jquery.min.js',
                    dest: 'app/lib/jquery.min.js'
                }, {
                    src: 'dependencies/moment/min/moment.min.js',
                    dest: 'app/lib/moment.min.js'
                }, {
                    src: 'dependencies/angular-bootstrap/ui-bootstrap.min.js',
                    dest: 'app/lib/ui-bootstrap.min.js'
                }, {
                    src: 'dependencies/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    dest: 'app/lib/ui-bootstrap-tpls.min.js'
                }, {
                    src: 'dependencies/lodash/lodash.min.js',
                    dest: 'app/lib/lodash.min.js'
                }]
            },
            bootStrapDependencies: {
                files: [{
                    src: 'dependencies/bootstrap/dist/js/bootstrap.min.js',
                    dest: 'app/lib/bootstrap.min.js'
                }, {
                    src: 'dependencies/bootstrap/dist/css/bootstrap.min.css',
                    dest: 'app/lib/bootstrap.min.css'
                }, {
                    expand: true,
                    src: 'dependencies/bootstrap/fonts/glyphicons*',
                    dest: 'app/fonts',
                    filter: 'isFile',
                    flatten: true
                }]
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                screwIE8: true,
                compress: {},
                preserveComments: 'some'
            },
            deployed: {
                files: {
                    'app/build/brickslopes.min.js': getMinifiedFiles()
                }
            }
        },

        ngtemplates: {
            TemplateModule: {
                // There is no way to exclude the index.html pages
                cwd: 'app/',
                src: ['partials/**/*.html', 'src/pages/**/*.html', 'src/shared/**/*.html', 'src/brickslopes/**/*.html'],
                dest: 'app/build/brickSlopesTemplates.js',
                options: {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeComments: true
                    }
                }
            }
        },

        'ddescribe-iit': {
            files: [
                'test/**/*.js'
            ]
        }
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('install', ['clean:dependencies', 'exec:npm', 'exec:bowerInstall', 'exec:bowerUpdate', 'bootstrap', 'copy:dependencies']);
    grunt.registerTask('buildTemplates', ['ngtemplates']);
    grunt.registerTask('jsbeautify-auto', ['watch:jsbeautify']);

    grunt.registerTask('test', ['ngtemplates', 'clean:test', 'karma:src']);
    grunt.registerTask('test-auto', ['ngtemplates', 'karma:auto', 'watch:karma']);

    grunt.registerTask('css', ['sass', 'compass', 'bootstrap']);
    grunt.registerTask('bootstrap', ['copy:bootstrap', 'exec:buildBootstrap', 'copy:bootStrapDependencies']);
    grunt.registerTask('css-auto', ['watch:sass']);
    grunt.registerTask('lint', ['ddescribe-iit', 'jshint:all', 'scsslint', 'jsbeautifier:verify']);
    grunt.registerTask('lint-auto', ['watch:scsslint']);

    grunt.registerTask('jshint-auto', ['watch:jshint']);

    grunt.registerTask('build', ['build-setup']);
    grunt.registerTask('build-setup', ['clean:build', 'lint', 'css', 'ngtemplates', 'uglify:deployed', 'copy:index', 'karma:src']);
    grunt.registerTask('build-deploy', ['build-setup', 'copy:index']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ddescribe-iit');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    function getWatchFiles() {
        var files = 'tests/js/unit/**/';
        if (grunt.option('grep')) {
            files += ('*' + grunt.option('grep') + '*');
        } else {
            files += '*Spec.js';
        }

        return files;
    }

    function getActiveFiles() {
        return [
            'app/js/**/*.js',
            'app/src/**/*.js',
            'tests/js/unit/**/*.js'
        ];
    }

    function getMinifiedFiles() {
        return [
            './app/.copyright.txt',
            'app/src/shared/constants.js',
            'app/src/brickslopes/brickslopes.js',
            'app/src/**/*.js',
            'app/build/brickSlopesTemplates.js'
        ];
    }

};
