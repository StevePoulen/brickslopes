'use strict';

// Declare app level module which depends on filters, and services
angular.module('brickSlopes', [
    'ngRoute',
    'brickSlopes.directives',
    'brickSlopes.services',
    'brickSlopes.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: '/partials/index.html', controller: 'bsIndex'})
    .when('/callUs/index.html', {templateUrl: '/partials/callUs.html', controller: 'bsIndex'})
    .otherwise({redirectTo: '/'});
}]);
