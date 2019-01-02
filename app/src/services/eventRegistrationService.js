(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .factory('EventRegistrationService', ['$q', '$http', function($q, $http) {
        function parseEventRegistrationData(data) {
            data = _.each(data, function(eventObj, key) {
                eventObj.total = eventObj.lineItems.total;
                eventObj.tShirtSize = 'No Thanks';
                eventObj.type = (eventObj.ageVerification == 'YES' ? 'AFOL' : 'TFOL');
                eventObj.meetAndGreet = 'NO';
                eventObj.draftOne = 'NO';
                eventObj.draftTwo = 'NO';
                eventObj.paidCTA = (eventObj.paid === 'YES');
                eventObj.nameBadge = 'NO';
                eventObj.showBadgeLine1 = false;
                eventObj.badgeLine1 = undefined;
                eventObj.showBadgeLine2 = false;
                eventObj.badgeLine2 = undefined;
                eventObj.showBadgeLine3 = false;
                eventObj.badgeLine3 = undefined;
                _.each(eventObj.lineItems.lineItems, function(lineItemObj) {
                    if (
                        lineItemObj.active === 'YES' &&
                        lineItemObj.isOwner === 'YES'
                    ) {
                        if (lineItemObj.lineItemCode === '10001') {
                            eventObj.tShirtSize = lineItemObj.size;
                        } else if (lineItemObj.lineItemCode === '10002') {
                            eventObj.meetAndGreet = 'YES'
                        } else if (lineItemObj.lineItemCode === '10007') {
                            eventObj.draftOne = 'YES'
                        } else if (lineItemObj.lineItemCode === '10008') {
                            eventObj.draftTwo = 'YES'
                        } else if (lineItemObj.lineItemCode === '10006') {
                            eventObj.badgeLine1 = lineItemObj.description;
                            eventObj.showBadgeLine1 = true;
                        } else if (lineItemObj.lineItemCode === '10003') {
                            eventObj.nameBadge = 'YES';
                        } else if (lineItemObj.lineItemCode === '10004') {
                            eventObj.badgeLine2 = lineItemObj.description;
                            eventObj.showBadgeLine2 = true;
                        } else if (lineItemObj.lineItemCode === '10005') {
                            eventObj.badgeLine3 = lineItemObj.description;
                            eventObj.showBadgeLine3 = true;
                        }
                    }
                });
                return eventObj;
            });

            return data;
        }
        return {
            get: function() {
                var delay= $q.defer();
                $http (
                    {
                        method: 'GET',
                        url: '/controllers/registered/eventRegistration.php'
                    }
                ).success(function(data, status, headers, config) {
                    delay.resolve(parseEventRegistrationData(data));
                }).error(function(data, status, headers, config) {
                    delay.reject(data);
                });

                return delay.promise;
            },

            submitRegistration: function(isCreate, dto) {
                return (isCreate ? this.create(dto) : this.patch(dto));
            },

            patch: function(eventRegistrationDTO) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'PATCH',
                        url: '/controllers/registered/eventRegistration.php',
                        data: eventRegistrationDTO,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).success(function(data, status, headers, config) {
                    delay.resolve(data);
                }).error(function(data, status, headers, config) {
                    delay.reject(data);
                });

                return delay.promise;
            },

            create: function(eventRegistrationDTO) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'POST',
                        url: '/controllers/registered/eventRegistration.php',
                        data: eventRegistrationDTO,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).success(function(data, status, headers, config) {
                    delay.resolve(data);
                }).error(function(data, status, headers, config) {
                    delay.reject(data);
                });

                return delay.promise;
            }
        }
    }]);
})(angular);
