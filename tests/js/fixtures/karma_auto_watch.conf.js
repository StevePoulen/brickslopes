module.exports = function(config){
    config.set({
    basePath : '../../../',

    files : [
      'app/lib/**/angular.min.js',
      'app/lib/**/angular-route.min.js',
      'tests/js/lib/angular-mocks.min.js',
      'app/lib/**/*.js',
      'app/js/**/*.js',
      'tests/js/unit/**/*.js'
    ],

    exclude : [
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-html2js-preprocessor',
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
   ],

    preprocessors : {
        'app/partials/**/*.html': 'html2js'
   }
})}
