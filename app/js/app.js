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
    .when('/emailUs/index.html', {templateUrl: '/partials/emailUs.html', controller: 'bsIndex'})
    .when('/who/index.html', {templateUrl: '/partials/who.html', controller: 'bsIndex'})
    .when('/what/index.html', {templateUrl: '/partials/what.html', controller: 'bsIndex'})
    .when('/when/index.html', {templateUrl: '/partials/when.html', controller: 'bsIndex'})
    .when('/where/index.html', {templateUrl: '/partials/where.html', controller: 'bsIndex'})
    .otherwise({redirectTo: '/'});
}]);
