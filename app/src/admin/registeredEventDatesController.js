(function(angular) {    
    'use strict';
    angular.module('brickSlopes').controller('adminRegisteredEventDates', [
        '$scope',
        'RegisteredEventDates',
        '$location',
        function(
            $scope,
            RegisteredEventDates,
            $location
        ) {
            $scope.eventDates;
            var currentIndex = 0;

            function formatDates(data) {
                angular.forEach(data, function(event) {
                    event.startDay = moment(event.startDate).format('dddd, MMMM Do');
                    event.startTime = moment(event.startDate).format('h:mm A');
                    event.endDay = moment(event.endDate).format('dddd, MMMM Do');
                    event.endTime = moment(event.endDate).format('h:mm A');
                });

                return data;
            }

            RegisteredEventDates.get().then(function(data) {
                $scope.eventDates = formatDates(data);
                $scope.editEventDate(0);
            });

            $scope.closeDialog = function() {
                $location.path("/admin/index.html");
            }

            $scope.editEventDate = function(index) {
                currentIndex = index;
                $scope.data = Object({
                    startDate: $scope.eventDates[index].startDate,
                    endDate: $scope.eventDates[index].endDate,
                    eventDatesId: $scope.eventDates[index].eventDatesId
                });
            }

            $scope.options = {
                showWeeks: false,
                hstep: 1,
                mstep: 15,
                isMeridian: true
            };

            $scope.submitDate = function() {
                RegisteredEventDates.update($scope.data).then(function(result) {
                    $scope.eventDates[currentIndex].startDate = $scope.data.startDate;
                    $scope.eventDates[currentIndex].endDate = $scope.data.endDate;
                    formatDates($scope.eventDates);
                });
            };
        }
    ]);
})(angular);
