module.exports = function(config){
    config.set({
    basePath : '../../../',

    files : [
        'app/lib/**/angular.min.js',
        'app/lib/**/angular-resource.min.js',
        'app/lib/**/angular-route.min.js',
        'tests/js/lib/angular-mocks.min.js',
        'app/src/brickslopes/brickslopes.js',
        'app/partials/registered/**/*.html',
        'app/partials/paid/**/*.html',
        'app/partials/directives/**/*.html',
        'app/lib/**/*.js',
        'app/js/**/*.js',
        'app/src/**/*.js',
        'tests/js/fixtures/artifacts/**/*.js',
        'tests/js/unit/**/*.js'
    ],

    exclude : [
    ],

    autoWatch : false,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    singleRun : true,

    plugins : [
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-commonjs',
      'jasmine-jquery'
   ],

    preprocessors : {
        'app/partials/registered/**/*.html': 'html2js',
        'app/partials/paid/**/*.html': 'html2js',
        'app/partials/directives/**/*.html': 'html2js'
    }
})}
