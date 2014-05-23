'use strict';

/* Controllers */
angular.module('brickSlopes.controllers', ['brickSlopes.services'])
.controller('bsIndex', ['$scope', function($scope) {
    console.log("here");
}])
.controller('afolIndex', ['$scope', '$location', 'GetAfolMocList', function($scope, $location, GetAfolMocList) {
    $scope.mocCount = 0;
    $scope.mocList = [];

    $scope.clickRegistration = function() {
        $location.path("/afol/eventRegistration.html");
    }

    $scope.clickSchedule = function() {
        $location.path("/afol/eventSchedule.html");
    }

    $scope.clickKeynote = function() {
        $location.path("/afol/eventKeynote.html");
    }

    $scope.clickMocRegistration = function() {
        $location.path("/afol/eventMocRegistration.html");
    }

    $scope.clickMocRegistration = function() {
        $location.path("/afol/eventMocRegistration.html");
    }

    $scope.clickFAQ = function() {
        $location.path("/afol/eventFAQ.html");
    }

    $scope.clickVenue = function() {
        $location.path("/afol/eventVenue.html");
    }

    $scope.clickHotel = function() {
        $location.path("/afol/eventHotel.html");
    }

    $scope.clickMocList= function() {
        $location.path("/afol/eventMocList.html");
    }

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }

    GetAfolMocList.getList().then(function(data) {
        $scope.mocList = data;

        GetAfolMocList.getCount().then(function(data) {
            $scope.mocCount = data;
        });
    });
}]);
