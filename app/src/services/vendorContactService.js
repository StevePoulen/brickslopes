(function(angular) {
    'use strict';

    angular.module('brickSlopes').factory('vendorContactService', [
        '$q',
        '$http',
        function(
            $q,
            $http
        ) {
            var service = Object({});

            service.create = function(vendorContactDTO) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'POST',
                        url: '/controllers/public/vendorContact.php',
                        data: vendorContactDTO,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).success(function(data) {
                    delay.resolve(data);
                });

                return delay.promise;
            };

            return service;
        }])
})(angular);
