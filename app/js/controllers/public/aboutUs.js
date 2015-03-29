'use strict';

angular.module('Public').controller('aboutUs', ['$scope', '$route', function($scope, $route) {
    $scope.eventId = $route.current.params.eventId;
}]);
