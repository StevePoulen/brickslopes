module.exports = function(config){
    config.set({
    basePath : '../../../',

    files : [
      'app/lib/**/angular.min.js',
      'app/lib/**/angular-route.min.js',
      'tests/js/lib/angular-mocks.min.js',
      'app/partials/afol/**/*.html',
      'app/lib/**/*.js',
      'app/js/**/*.js',
      'tests/js/fixtures/artifacts/**/*.js',
      'tests/js/unit/**/*.js'
    ],

    exclude : [
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-jasmine'
    ],

    preprocessors : {
        'app/partials/afol/**/*.html': 'html2js'
    }
})}
