(function(angular) {
    'use strict';

    angular.module('constants', []).constant('Environment', {
        displayTickets: false,
        registerGames: true,
        currentEvent: 5
    });
})(angular);