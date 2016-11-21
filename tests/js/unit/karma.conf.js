// Karma configuration
// Generated on Wed Apr 02 2014 15:53:09 GMT-0600 (MDT)
module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../../../',

        // list of files / patterns to load in the browser
        files: [
            'app/lib/**/angular.min.js',
            'app/lib/**/angular-resource.min.js',
            'app/lib/**/angular-route.min.js',
            'tests/js/lib/angular-mocks.min.js',
            'tests/js/fixtures/artifacts/constants.js',
            'app/src/brickslopes/brickslopes.js',
            'app/partials/registered/**/*.html',
            'app/partials/paid/**/*.html',
            'app/partials/directives/**/*.html',
            'app/lib/**/*.js',
            'app/js/**/*.js',
            'app/src/**/*.js',
            'tests/js/fixtures/artifacts/**/*.js',
            'app/build/brickSlopesTemplates.js',
            'tests/js/unit/**/*.js'
        ],

        // list of files to exclude
        exclude: [ ],

        preprocessors: {
            'app/js/**/*.js': ['coverage'],
            'app/src/**/*.js': ['coverage']
        },

        // frameworks to use
        frameworks: ['jasmine'],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 5000,
        browserNoActivityTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,

        coverageReporter: {
            reporters: [{
                type: 'html',
                dir: 'build/test/html'
            }, {
                type: 'cobertura',
                dir: 'build/test/xml',
                file: 'coverage.xml'
            }]
        }
    });
};
