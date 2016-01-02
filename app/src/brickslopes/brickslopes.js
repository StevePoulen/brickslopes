'use strict';

// Declare app level module which depends on filters, and services
angular.module('brickSlopes', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'brickSlopes.directives',
    'brickSlopes.services',
    'brickSlopes.controllers',
    'Admin',
    'Public',
    'BrickSlopesShared',
    'TemplateModule'
]).
config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
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
        '/volunteers',
        {
            templateUrl: 'partials/public/volunteers.html'
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
        '/registered/index.html',
        {
            templateUrl: '/partials/registered/index.html',
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
        '/registered/editProfile.html',
        {
            templateUrl: '/partials/registered/editProfile.html',
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
        '/admin/registeredGames.html',
        {
            templateUrl: '/partials/admin/registeredGames.html',
            controller: 'adminRegisteredGames'
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
        '/admin/printRegisteredMocs',
        {
            templateUrl: '/partials/admin/printRegisteredMocs.html',
            controller: 'PrintMocs'
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
            controller: 'afolMe'
        }
    )
    .when(
        '/paid/eventGames.html',
        {
            templateUrl: '/partials/paid/eventGames.html',
            controller: 'afolEventGames'
        }
    )
    .when(
        '/paid/eventThemes.html',
        {
            templateUrl: '/partials/paid/eventThemes.html',
            controller: 'afolEventThemes'
        }
    )
    .when(
        '/registered/eventPayment.html',
        {
            templateUrl: '/partials/registered/eventPayment.html',
            controller: 'afolEventPayment'
        }
    )
    .when(
        '/registered/:eventId/:storeId/vendorRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/vendors/storeRegistration.html?eventId='+params.eventId+'&storeId='+params.storeId;
            },
            controller: 'vendorRegistration'
        }
    )
    .when(
        '/registered/:eventId/:storeId/tableRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/vendors/tableRegistration.html';
            },
            controller: 'TableRegistration'
        }
    )
    .when(
        '/registered/:eventId/:tableId/updateTableRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/vendors/tableRegistration.html';
            },
            controller: 'TableRegistration'
        }
    )
    .when(
        '/registered/:associateId/associateRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/vendors/associateRegistration.html';
            },
            controller: 'AssociateRegistration'
        }
    )
    .when(
        '/registered/:eventId/:storeId/associateRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/vendors/associateRegistration.html';
            },
            controller: 'AssociateRegistration'
        }
    )
    .when(
        '/registered/:eventId/eventVendors.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/vendors/eventVendors.html?eventId='+params.eventId
            },
            controller: 'afolEventVendors'
        }
    )
    .when(
        '/registered/:eventId/eventRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/registered/eventRegistration.html?eventId='+params.eventId
            },
            controller: 'afolEventRegistration'
        }
    )
    .when(
        '/registered/eventSchedule.html',
        {
            templateUrl: '/partials/registered/eventSchedule.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/schedule',
        {
            templateUrl: '/partials/registered/mobileSchedule.html'
        }
    )
    .when(
        '/registered/eventKeynote.html',
        {
            templateUrl: '/partials/registered/eventKeynote.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/paid/:eventId/eventMocRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/paid/eventMocRegistration.html?eventId='+params.eventId
            },
            controller: 'afolMocRegistration'
        }
    )
    .when(
        '/paid/:eventId/:mocId/eventMocRegistration.html',
        {
            templateUrl: function(params) {
                return '/partials/paid/eventMocRegistration.html?eventId='+params.eventId+'&mocId='+params.mocId
            },
            controller: 'afolMocRegistration'
        }
    )
    .when(
        '/registered/eventHotel.html',
        {
            templateUrl: '/partials/registered/eventHotel.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/registered/eventVenue.html',
        {
            templateUrl: '/partials/registered/eventVenue.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/paid/eventMocList.html',
        {
            templateUrl: '/partials/paid/eventMocList.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/registered/eventFAQ.html',
        {
            templateUrl: '/partials/registered/eventFAQ.html',
            controller: 'afolIndex'
        }
    )
    .when(
        '/registered/login.html',
        {
            templateUrl: '/partials/public/login/index.html',
            controller: 'afolLogin'
        }
    )
    .when(
        '/aboutus/:eventId',
        {
            templateUrl: '/partials/public/aboutUs/index.html',
            controller: 'aboutUs'
        }
    )
    .when(
        '/topten/:eventId',
        {
            templateUrl: '/partials/public/aboutUs/index.html',
            controller: 'topten'
        }
    )
    .otherwise(
        {
            redirectTo: '/'
        }
    );

    $locationProvider.html5Mode(true);

}]);

angular.module('BrickSlopesShared', []);

angular.module('TemplateModule', []);
angular.module('brickSlopes.controllers', ['brickSlopes.services', 'ngRoute']);
angular.module('brickSlopes.directives', ['TemplateModule', 'brickSlopes.services']);
angular.module('brickSlopes.services', ['ngResource', 'BrickSlopesShared'])
angular.module('Admin', ['brickSlopes.services']);
angular.module('Public', []);
