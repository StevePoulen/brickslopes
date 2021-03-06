(function(angular) {
    'use strict';

    angular.module('brickSlopes').factory('emailUsService', [
        '$q',
        '$http',
        function(
            $q,
            $http
        ) {
            var service = Object({});

            service.create= function(emailDTO) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'POST',
                        url: '/controllers/public/emailUs.php',
                        data: emailDTO,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).success(function(data) {
                    delay.resolve(data);
                });

                return delay.promise;
            };

            return service;
        }
    ])
})(angular);
