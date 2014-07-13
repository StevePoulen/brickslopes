'use strict';

// Declare app level module which depends on filters, and services
angular.module('brickSlopes', [
    'ngRoute',
    'ngAnimate',
    'brickSlopes.directives',
    'brickSlopes.services',
    'brickSlopes.controllers'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
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
        '/tickets.html',
        {
            templateUrl: 'partials/public/tickets.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/packages.html',
        {
            templateUrl: 'partials/public/packages.html',
            controller: 'bsIndex'
        }
    )
    .when(
        '/afol/comingSoon.html',
        {
            templateUrl: 'partials/afol/comingSoon.html',
            controller: 'afolIndex'
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
            controller: 'emailUs'
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
        '/admin/index.html',
        {
            templateUrl: '/partials/admin/index.html',
            controller: 'afolAdmin'
        }
    )
    .when(
        '/admin/:emailType/emails',
        {
            templateUrl: '/partials/admin/emails/eventRegistration.html',
            controller: 'adminEmail'
        }
    )
    .when(
        '/admin/registeredAfols.html',
        {
            templateUrl: '/partials/admin/registeredAfols.html',
            controller: 'adminRegisteredAfols'
        }
    )
    .when(
        '/afol/eventAfols.html',
        {
            templateUrl: '/partials/afol/eventAfols.html',
            controller: 'eventAfols'
        }
    )
    .when(
        '/afol/eventMe.html',
        {
            templateUrl: '/partials/afol/eventMe.html',
            controller: 'afolMe'
        }
    )
    .when(
        '/afol/eventGames.html',
        {
            templateUrl: '/partials/afol/eventGames.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/afol/eventThemes.html',
        {
            templateUrl: '/partials/afol/eventThemes.html',
            controller: 'afolEventThemes'
        }
    )
    .when(
        '/afol/eventPayment.html',
        {
            templateUrl: '/partials/afol/eventPayment.html',
            controller: 'afolEventPayment'
        }
    )
    .when(
        '/afol/:eventId/eventRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/afol/eventRegistration.html?eventId='+params.eventId
            },
            controller: 'afolEventRegistration'
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
            templateUrl: '/partials/public/login/index.html',
            controller: 'afolLogin'
        }
    )
    .otherwise(
        {
            redirectTo: '/'
        }
    );
}]);
