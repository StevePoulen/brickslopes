'use strict';

// Declare app level module which depends on filters, and services
angular.module('brickSlopes', [
    'ngRoute',
    'underscore',
    'brickSlopes.directives',
    'brickSlopes.controllers'
    //'brickSlopes.filters',
    //'brickSlopes.services',
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: '/partials/index.html', controller: 'bsIndex'});
    $routeProvider.otherwise({redirectTo: '/'});
}]);
