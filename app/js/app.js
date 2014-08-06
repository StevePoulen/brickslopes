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
        '/afol/editProfile.html',
        {
            templateUrl: '/partials/afol/editProfile.html',
            controller: 'afolEditProfile'
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
        '/registered/eventGames.html',
        {
            templateUrl: '/partials/registered/eventGames.html',
            controller: 'afolEventGames'
        }
    )
    .when(
        '/registered/eventThemes.html',
        {
            templateUrl: '/partials/registered/eventThemes.html',
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
        '/afol/:eventId/eventVendors.html',
        {
            templateUrl: function(params) {
                return '/partials/afol/eventVendors.html?eventId='+params.eventId
            },
            controller: 'afolEventVendors'
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
        '/registered/:eventId/eventMocRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/eventMocRegistration.html?eventId='+params.eventId
            },
            controller: 'afolMocRegistration'
        }
    )
    .when(
        '/registered/:eventId/:mocId/eventMocRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/eventMocRegistration.html?eventId='+params.eventId+'&mocId='+params.mocId
            },
            controller: 'afolMocRegistration'
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
        '/registered/eventMocList.html',
        {
            templateUrl: '/partials/registered/eventMocList.html',
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
