'use strict';

angular.module('Admin').controller('adminRegisteredGames', ['$scope', 'RegisteredGames', '$location', function($scope, RegisteredGames, $location) {
    $scope.registeredAfols = undefined;
    $scope.eventId = 2;
    $scope.eventName = undefined;
    $scope.predicate = 'gameName';
    $scope.reverse = false;
    $scope.showModal = false;

    RegisteredGames.get($scope.eventId).then(function(data) {
        $scope.registeredGames = data;
    });

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}]);
