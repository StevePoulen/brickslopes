'use strict';

/* Controllers */
angular.module('brickSlopes.controllers', ['brickSlopes.services'])
.controller('bsIndex', ['$scope', '$location', function($scope, $location) {
}])
.controller('bsHeader', ['$scope', '$window', '$location', function($scope, $window, $location) {
    $scope.clickBuilder = function() {
        if ($window.sessionStorage.token) {
            $location.path("/afol/index.html");
        } else {
            $location.path("/afol/login.html");
        }
    }

    $scope.authenticationText = function() {
        if ($window.sessionStorage.firstName) {
            return $window.sessionStorage.firstName + "'s Site";
        } else {
            return "Builder Login";
        }
    }

    $scope.logout = function() {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.firstName;
        delete $window.sessionStorage.lastName;
        $location.path("/afol/login.html");
    }

    $scope.authenticated = function() {
        return ($window.sessionStorage.token ? true : false);
    }
}])
.controller('afolLogin', ['$scope', '$location', 'Auth', '$window', function($scope, $location, Auth, $window) {

    $scope.showLogin = true;
    $scope.verifying = false;

    function serializeLoginJson() {
        return {
            email: $scope.email,
            password: $scope.password
        }
    }

    function serializeRegisterJson() {
        return {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.registerEmail,
            password: $scope.registerPassword,
            password2: $scope.registerPasswordVerification
        }
    }

    function storeSession(data) {
        $window.sessionStorage.token = data.token;
        $window.sessionStorage.firstName = data.firstName;
        $window.sessionStorage.lastName = data.lastName;
    }

    $scope.submitLogin = function() {
        $scope.displayErrorMessage = "";
        Auth.login(serializeLoginJson()).then(function(response) {
            storeSession(response.data);
            $location.path('/afol/index.html');
        }, function() {
            $scope.displayErrorMessage = "The email or password you entered is incorrect.";
        });
    }

    $scope.seeRegistration = function() {
        $scope.showLogin = false;
    }

    $scope.register = function() {
        $scope.verifying = true;
        Auth.register(serializeRegisterJson()).then(function(response) {
            if (response.status === 201) {
                storeSession(response.data);
                $location.path('/afol/index.html');
            }
        }, function(data) {
            console.log("here", data);
            $scope.displayErrorMessage = "The email or password you entered is incorrect.";
        });
    }

    $scope.closeDialog = function() {
        $location.path("/");
    }
}])
.controller('afolIndex', ['$scope', '$location', 'GetAfolMocList', function($scope, $location, GetAfolMocList) {
    $scope.mocCount = 0;
    $scope.mocList = [];

    $scope.clickRegistration = function() {
        //$location.path("/afol/eventRegistration.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickSchedule = function() {
        //$location.path("/afol/eventSchedule.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickKeynote = function() {
        //$location.path("/afol/eventKeynote.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickCollection = function() {
        //$location.path("/afol/eventCollection.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickMocRegistration = function() {
        //$location.path("/afol/eventMocRegistration.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickMocList = function() {
        //$location.path("/afol/eventMocList.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickVendors = function() {
        //$location.path("/afol/eventVendors.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickAfols= function() {
        //$location.path("/afol/eventVfols.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickFAQ = function() {
        //$location.path("/afol/eventFAQ.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickVenue = function() {
        $location.path("/afol/eventVenue.html");
    }

    $scope.clickHotel = function() {
        $location.path("/afol/eventHotel.html");
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
