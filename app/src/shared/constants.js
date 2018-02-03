(function(angular) {
    'use strict';

    angular.module('constants', []).constant('Environment', {
        displayTickets: true,
        registerGames: true,
        currentEvent: 5
    });
})(angular);