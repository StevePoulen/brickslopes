(function(angular) {
    'use strict';
    angular.module('brickSlopes').factory('RegisteredEventDates', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            var eventDates;

            return {
                get: function() {
                    if (!angular.isDefined(eventDates)) {
                        eventDates = $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/admin/eventDates.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent()
                                }
                            }
                        ).then(function(data) {
                            return data.data;
                        }));
                    }

                    return eventDates;
                },

                update: function(dateEventDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'PATCH',
                            url: '/controllers/admin/eventDates.php',
                            data: dateEventDTO
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(status);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                }
            }
        }
    ]);
})(angular);
