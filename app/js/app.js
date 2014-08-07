'use strict';

// Declare app level module which depends on filters, and services
angular.module('brickSlopes', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
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
            templateUrl: 'partials/public/index.html',
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
        '/registered/comingSoon.html',
        {
            templateUrl: 'partials/registered/comingSoon.html',
            controller: 'registeredIndex'
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
        '/registered/index.html',
        {
            templateUrl: '/partials/registered/index.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/admin/index.html',
        {
            templateUrl: '/partials/admin/index.html',
            controller: 'registeredAdmin'
        }
    )
    .when(
        '/registered/editProfile.html',
        {
            templateUrl: '/partials/registered/editProfile.html',
            controller: 'registeredEditProfile'
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
        '/admin/feedback.html',
        {
            templateUrl: '/partials/admin/feedback.html',
            controller: 'adminFeedback'
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
        '/admin/registeredMocs.html',
        {
            templateUrl: '/partials/admin/registeredMocs.html',
            controller: 'adminRegisteredMocs'
        }
    )
    .when(
        '/admin/registeredUsers.html',
        {
            templateUrl: '/partials/admin/registeredUsers.html',
            controller: 'adminRegisteredUsers'
        }
    )
    .when(
        '/registered/eventAfols.html',
        {
            templateUrl: '/partials/registered/eventAfols.html',
            controller: 'eventAfols'
        }
    )
    .when(
        '/registered/eventMe.html',
        {
            templateUrl: '/partials/registered/eventMe.html',
            controller: 'registeredMe'
        }
    )
    .when(
        '/paid/eventGames.html',
        {
            templateUrl: '/partials/paid/eventGames.html',
            controller: 'registeredEventGames'
        }
    )
    .when(
        '/paid/eventThemes.html',
        {
            templateUrl: '/partials/paid/eventThemes.html',
            controller: 'registeredEventThemes'
        }
    )
    .when(
        '/registered/eventPayment.html',
        {
            templateUrl: '/partials/registered/eventPayment.html',
            controller: 'registeredEventPayment'
        }
    )
    .when(
        '/registered/:eventId/eventVendors.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/eventVendors.html?eventId='+params.eventId
            },
            controller: 'registeredEventVendors'
        }
    )
    .when(
        '/registered/:eventId/eventRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/eventRegistration.html?eventId='+params.eventId
            },
            controller: 'registeredEventRegistration'
        }
    )
    .when(
        '/registered/eventSchedule.html',
        {
            templateUrl: '/partials/registered/eventSchedule.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/registered/eventKeynote.html',
        {
            templateUrl: '/partials/registered/eventKeynote.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/paid/:eventId/eventMocRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/paid/eventMocRegistration.html?eventId='+params.eventId
            },
            controller: 'registeredMocRegistration'
        }
    )
    .when(
        '/paid/:eventId/:mocId/eventMocRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/paid/eventMocRegistration.html?eventId='+params.eventId+'&mocId='+params.mocId
            },
            controller: 'registeredMocRegistration'
        }
    )
    .when(
        '/registered/eventHotel.html',
        {
            templateUrl: '/partials/registered/eventHotel.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/registered/eventVenue.html',
        {
            templateUrl: '/partials/registered/eventVenue.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/paid/eventMocList.html',
        {
            templateUrl: '/partials/paid/eventMocList.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/registered/eventFAQ.html',
        {
            templateUrl: '/partials/registered/eventFAQ.html',
            controller: 'registeredIndex'
        }
    )
    .when(
        '/registered/login.html',
        {
            templateUrl: '/partials/public/login/index.html',
            controller: 'registeredLogin'
        }
    )
    .otherwise(
        {
            redirectTo: '/'
        }
    );
}]);
