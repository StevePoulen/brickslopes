(function(angular) {
    'use strict';
    angular.module('brickSlopes.controllers').controller('bsIndex', [
        '$scope',
        '$location',
        'EventDates',
        function(
            $scope,
            $location,
            EventDates
        ) {
            $scope.eventYear = '2014';
            $scope.publicEventDates = undefined;
            $scope.publicDateList = [];

            EventDates.getEventYear().then(function(year) {
                $scope.eventYear = year;
            });

            EventDates.getPublicDatesTogether().then(function(dates) {
                $scope.publicEventDates = dates;
            });

            EventDates.getPublicDates().then(function(dateList) {
                $scope.publicDateList = dateList;
            });

            $scope.tickets = function() {
                $location.path("/tickets.html");
            }

            $scope.modernBrickWarfare = function() {
                openNewWindow("http://modernbrickwarfare.com/");
            }

            $scope.chowrenToys = function() {
                openNewWindow("http://www.chowrentoys.com/");
            }

            $scope.purchaseSaturdayTickets = function() {
                openNewWindow("https://www.eventbrite.com/e/brickslopes-slc-2015-saturday-tickets-15610137341");
            }

            $scope.purchaseFridayTickets = function() {
                openNewWindow("https://www.eventbrite.com/e/brickslopes-slc-2015-tickets-15387662914");
            }

            $scope.packages = function() {
                //$location.path("/packages.html");
                $location.path("/when/index.html");
            }

            $scope.packageList = ['Adult On-line ($7.00*)', 'Child On-line ($1.00*)', 'Adult Ticket and Fig ($12.00*)', 'Child Ticket and Fig ($6.00*)', 'Adult Ticket and Shirt ($22.00*)', 'Child Ticket and Shirt ($16.00*)', 'Adult Ticket, Fig and Shirt ($25.00*)', 'Child Ticket, Fig and Shirt ($21.00*)'];
        }
    ]);
})(angular);
