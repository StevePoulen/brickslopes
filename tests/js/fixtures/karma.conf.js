module.exports = function(config){
    config.set({
    basePath : '../../../',

    files : [
      'app/lib/**/angular.min.js',
      'app/lib/**/angular-route.min.js',
      'tests/js/lib/angular-mocks.min.js',
      'app/lib/**/jquery.min.js',
      'app/lib/**/underscore.min.js',
      'app/js/**/*.js',
      'tests/js/unit/**/*.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
    ],

    exclude : [
    ],

    preprocessors: {
        '*.html': ['html2js']
    },

    autoWatch : false,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    singleRun : true,

    plugins : [
      'karma-jasmine',
      'jasmine-jquery',
      'karma-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
   ]
})}
