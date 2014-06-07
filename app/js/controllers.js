'use strict';

/* Controllers */
angular.module('brickSlopes.controllers', ['brickSlopes.services', 'ngRoute'])
.controller('bsIndex', ['$scope', function($scope) {
    $("#splashPageCTA").show(500);
}])
.controller('emailUs', ['$scope', function($scope) {
    $("#splashPageCTA").show(500);
    $scope.comments = 'Comments ...';
    $scope.captchaInit = "12345";

    $scope.$watch('comments', function(newValue, oldValue) {
        if (oldValue === 'Comments ...' && newValue !== 'Comments ...') {
            $('#emailComments').removeClass('greyFont');
            $scope.comments = newValue.substr(12,13);
        } else if (newValue === '') {
            $('#emailComments').addClass('greyFont');
            $scope.comments = 'Comments ...';
        }
    });

    function serializeEmailUsJson() {
        return {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email,
            comments: $scope.comments
        }
    }

/*
    Auth.reset(serializeEmailUsJson()).then(function(response) {
        $scope.verifying = false;
        $scope.resetEmail = "";
        $scope.resetPasswordForm.$setPristine();
        $scope.displayMessage = "An e-mail with reset information has been sent to your account";
    });
    */
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
    $("#splashPageCTA").hide(500);
    $scope.showLogin = true;
    $scope.verifying = false;
    $scope.showResetPassword = false;
    $scope.displayErrorMessage = "";
    $scope.displayMessage = "";

    function serializeResetPasswordJson() {
        return {
            email: $scope.resetEmail
        }
    }

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
        $scope.verifying = true;
        Auth.login(serializeLoginJson()).then(function(response) {
            storeSession(response.data);
            $location.path('/afol/index.html');
        }, function() {
            $scope.verifying = false;
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
            $scope.verifying = false;
        }, function(data) {
            $scope.verifying = false;
            if (data.status === 400 && data.data === 'Duplicate E-mail') {
                $scope.displayErrorMessage = "The email is already in our system. Please login.";
                $scope.showLogin = true;
                $scope.showResetPassword = true;
            }
        });
    }

    $scope.seeResetPassword = function() {
        $scope.showResetPassword = true;
    }

    $scope.resetPassword = function() {
        $scope.verifying = true;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.firstName;
        delete $window.sessionStorage.lastName;
        Auth.reset(serializeResetPasswordJson()).then(function(response) {
            $scope.verifying = false;
            $scope.resetEmail = "";
            $scope.resetPasswordForm.$setPristine();
            $scope.displayMessage = "An e-mail with reset information has been sent to your account";
        });
    }

    $scope.closeDialog = function() {
        $location.path("/");
    }
}])
.controller('afolEventRegistration', ['$scope', '$location', 'EventDetails', 'EventRegistration', '$route', function($scope, $location, EventDetails, eventRegistration, $route) {
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.success = true;
    $scope.timer = false;
    $scope.eventId = $route.current.params.eventId;
    $scope.eventDetails = {city: 'loading'};
    $scope.meetAndGreet = 'YES';
    $scope.ageVerification = 'YES';

    function serializeRegistrationJson() {
        return {
            eventId: $scope.eventId,
            badgeLine1: $scope.badgeLine1,
            badgeLine2: $scope.badgeLine2,
            meetAndGreet: $scope.meetAndGreet,
            ageVerification: $scope.ageVerification,
            comments: $scope.comments,
            type: 'afol'
        }
    }

    $scope.submitRegistration = function() {
        $scope.verifying = true;
        eventRegistration.create(serializeRegistrationJson()).then(function(response) {
            $location.path('/afol/eventMe.html');
        }, function() {
            $scope.verifying = false;
            $scope.displayMessage = "There was an error submitting your data. Please try again.";
            $scope.success = false;
            $scope.timer = true;
        });
    }

    EventDetails.get($scope.eventId).then(function(data) {
        $scope.eventDetails=data.data;
    });

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }
}])
.controller('afolMe', ['$scope', '$location', 'Auth', 'EventRegistration', function($scope, $location, Auth, EventRegistration) {
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.timer = false;
    $scope.success = true;
    $scope.eventList = {}

    function serializeChangePasswordJson() {
        return {
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword
        }
    }

    function resetPasswordFields() {
        $scope.oldPassword = "";
        $scope.newPassword = "";
        $scope.newPasswordVerify = "";
    }

    $scope.changePassword = function() {
        $scope.verifying = true;
        Auth.update(serializeChangePasswordJson()).then(function(response) {
            resetPasswordFields();
            $scope.changePasswordForm.$setPristine();
            $scope.verifying = false;
            $scope.displayMessage = "Password Changed";
            $scope.timer = true;
            $scope.success = true;
        }, function() {
            $scope.verifying = false;
            resetPasswordFields();
            $scope.displayMessage = "The password you entered is incorrect.";
            $scope.success = false;
            $scope.timer = true;
        });
    }

    $scope.clickRegistration = function(eventId) {
        $location.path("/afol/" + eventId + "/eventRegistration.html");
    }

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }

    function displayRegisterEventButton() {
        return Object.keys($scope.eventList).length;
    }

    EventRegistration.get().then(function(data) {
        $scope.eventList = data;
        $scope.displayRegisterEventCTA = displayRegisterEventButton();
    });
}])
.controller('afolIndex', ['$scope', '$location', 'GetAfolMocList', '$window', function($scope, $location, GetAfolMocList, $window) {
    $("#splashPageCTA").hide(500);
    $scope.mocCount = 0;
    $scope.vendorCount = 0;
    $scope.mocList = [];
    $scope.userName = $window.sessionStorage.firstName + "'s Site";

    $scope.clickMe = function() {
        $location.path("/afol/eventMe.html");
        //$location.path("/afol/comingSoon.html");
    }

    $scope.clickThemes = function() {
        //$location.path("/afol/eventThemes.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickGames = function() {
        //$location.path("/afol/eventGames.html");
        $location.path("/afol/comingSoon.html");
    }

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
