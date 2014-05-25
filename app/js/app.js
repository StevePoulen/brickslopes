'use strict';

// Declare app level module which depends on filters, and services
angular.module('brickSlopes', [
    'ngRoute',
    'ngAnimate',
    'brickSlopes.directives',
    'brickSlopes.services',
    'brickSlopes.controllers'
]).
config(['$routeProvider', '$httpProvider',  function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider
    .when(
        '/',
        {
            templateUrl: '/partials/public/index.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/error.html',
        {
            templateUrl: 'partials/public/error.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/callUs/index.html',
        {
            templateUrl: '/partials/public/callUs.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/emailUs/index.html',
        {
            templateUrl: '/partials/public/emailUs.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/who/index.html',
        {
            templateUrl: '/partials/public/who.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/what/index.html',
        {
            templateUrl: '/partials/public/what.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/when/index.html',
        {
            templateUrl: '/partials/public/when.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/where/index.html',
        {
            templateUrl: '/partials/public/where.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/afol/index.html',
        {
            templateUrl: '/partials/afol/index.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventRegistration.html',
        {
            templateUrl: '/partials/afol/eventRegistration.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventSchedule.html',
        {
            templateUrl: '/partials/afol/eventSchedule.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventKeynote.html',
        {
            templateUrl: '/partials/afol/eventKeynote.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventMocRegistration.html',
        {
            templateUrl: '/partials/afol/eventMocRegistration.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventHotel.html',
        {
            templateUrl: '/partials/afol/eventHotel.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventVenue.html',
        {
            templateUrl: '/partials/afol/eventVenue.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventMocList.html',
        {
            templateUrl: '/partials/afol/eventMocList.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventFAQ.html',
        {
            templateUrl: '/partials/afol/eventFAQ.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/login.html',
        {
            templateUrl: '/partials/public/login.html',
            controller: 'afolLogin'
        }
    )
    .otherwise(
        {
            redirectTo: '/'
        }
    );
}]);
