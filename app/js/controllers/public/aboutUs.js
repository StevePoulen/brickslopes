'use strict';

angular.module('Public').controller('aboutUs', ['$scope', '$route', function($scope, $route) {
    $scope.eventId = $route.current.params.eventId;

    console.log($scope.eventId);

    if ($scope.eventId == '22') {
        $scope.imageUrl = "/images/emails/images/t-shirt-2015.png";
    }
}]);

