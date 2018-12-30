(function(angular) {
    'use strict';
    angular.module('brickSlopes').controller('bsIndex', [
        'Environment',
        'EventDates',
        '$location',
        '$scope',
        function(
            Environment,
            EventDates,
            $location,
            $scope
        ) {
            $scope.eventYear = '2019';
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

            $scope.purchaseTickets = function() {
                openNewWindow("https://www.eventbrite.com/e/brickslopes-2017-tickets-31429702085");
            }

            $scope.packages = function() {
                $location.path("/tickets.html");
            };

            $scope.showOnlineTickets = function() {
                return Environment.displayTickets;
            };

            $scope.packageList = ['Adult On-line ($7.00*)', 'Child (8 and under) (Free)', 'Adult Ticket and Fig ($13.00*)', 'Child Ticket and Fig ($6.00*)', 'Adult Ticket and Shirt ($23.00*)', 'Child Ticket and Shirt ($16.00*)', 'Adult Ticket, Fig and Shirt ($29.00*)', 'Child Ticket, Fig and Shirt ($22.00*)'];
        }
    ]);
})(angular);
