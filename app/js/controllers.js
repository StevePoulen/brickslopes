'use strict';

/* Controllers */
angular.module('brickSlopes.controllers', ['brickSlopes.services', 'ngRoute'])
.controller('bsIndex', ['$scope', '$location', 'EventDates', function($scope, $location, EventDates) {
    $("#splashPageCTA").show(500);

    EventDates.getEventYear(2).then(function(year) {
        $scope.eventYear = year;
    });

    EventDates.getPublicDatesTogether(2).then(function(dates) {
        $scope.publicEventDates = dates;
    });

    EventDates.getPublicDates(2).then(function(dateList) {
        $scope.publicDateList = dateList;
    });

    $scope.tickets = function() {
        $location.path("/tickets.html");
    }

    $scope.packages = function() {
        $location.path("/packages.html");
    }
}])
.controller('emailUs', ['$scope', 'EmailUs', function($scope, EmailUs) {
    $("#splashPageCTA").show(500);
    $scope.comments = 'Comments ...';
    $scope.captchaInit = "LeGo1";
    $scope.timer = false;
    $scope.verifying = false;

    function serializeEmailUsJson() {
        return {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email,
            comments: $scope.comments
        }
    }

    $scope.submitEmail = function() {
        $scope.verifying = true;
        EmailUs.create(serializeEmailUsJson()).then(function(response) {
            $scope.emailUsForm.$setPristine();
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.email = "";
            $scope.comments = "Comments ...";
            $scope.captchaInit = "AwEs0me";
            $scope.captcha= "";
            $scope.displayMessage = "Your e-mail has been sent.";
            $scope.timer = true;
            $scope.verifying = false;
        });
    }
}])
.controller('bsHeader', ['$scope', '$window', '$location', function($scope, $window, $location) {
    $scope.showAfolLogin = false;
    $scope.clickBuilder = function() {
        if ($window.sessionStorage.token) {
            $location.path("/afol/index.html");
        } else {
            $location.path("/afol/login.html");
        }
    }

    $scope.clickAdmin = function() {
        $location.path("/afol/admin.html");
    }

    $scope.authenticationText = function() {
        if ($window.sessionStorage.firstName) {
            return $window.sessionStorage.firstName + "'s Site";
        } else {
            return "Builder Login";
        }
    }

    $scope.adminText = function() {
        if ($window.sessionStorage.admin == 'YES' && $window.sessionStorage.token) {
            return "| Admin";
        } else {
            return "";
        }
    }

    $scope.logout = function() {
        deleteSession($window);
        $location.path("/afol/login.html");
    }

    $scope.authenticated = function() {
        return ($window.sessionStorage.token ? true : false);
    }

    $scope.admin = function() {
        return ($window.sessionStorage.admin == 'YES' ? true : false);
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
        $window.sessionStorage.admin = data.admin;
    }

    $scope.submitLogin = function() {
        $scope.verifying = true;
        Auth.login(serializeLoginJson()).then(function(response) {
            storeSession(response.data);
            $location.path('/afol/index.html');
            $scope.verifying = false;
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
        deleteSession($window);
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
.controller('afolEventPayment', ['$scope', '$location', 'RegistrationLineItems', '$http', function($scope, $location, RegistrationLineItems, $http) {
    $("#splashPageCTA").hide();
    $scope.registrationLineItems = undefined;
    $scope.eventId = 2;
    $scope.totalAmount = 0;
    $scope.paypalPayload = {
        'cmd': '_cart',
        'upload': '1',
        'business': 'events@brickslopes.com',
        'currency_code': 'USD'
    };

    function getPaypalPayload() {
        var lineItemCounter = 1;
        _.each($scope.registrationLineItems, function(lineItem) {
            $scope.paypalPayload['item_name_' + lineItemCounter] = lineItem.lineItem;
            $scope.paypalPayload['amount_' + lineItemCounter] = lineItem.total;
            $scope.paypalPayload['shipping_' + lineItemCounter] = 0;
            lineItemCounter++;
        });
        return $scope.paypalPayload;
    }

    RegistrationLineItems.get($scope.eventId).then(function(data) {
        $scope.registrationLineItems = data[$scope.eventId]['lineItems'];
        $scope.totalAmount = data[$scope.eventId]['total'];

        $scope.createFormData();
    });

    $scope.createFormData = function() {
        _.each(getPaypalPayload(), function(value, key) {
            var element = $("<input type='hidden'>")
                .attr("name", key)
                .attr("value", value);
            $("#paypalSubmitForm").append(element);
        });
    }

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }
}])
.controller('afolEventRegistration', ['$scope', '$location', 'EventDetails', 'EventRegistration', '$route', 'EventDates', function($scope, $location, EventDetails, eventRegistration, $route, EventDates) {
    $("#splashPageCTA").hide();
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.success = true;
    $scope.timer = false;
    $scope.eventId = $route.current.params.eventId;
    $scope.eventDetails = {city: 'loading'};
    $scope.meetAndGreet = 'YES';
    $scope.comments = 'Comments ...';
    $scope.ageVerification = 'YES';
    $scope.discountDate = undefined;
    $scope.passDates = undefined;
    $scope.passType = undefined;
    $scope.meetAndGreetDinnerDate = undefined;
    $scope.shirtSizes = ['No Thanks', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
    $scope.tShirtSize = "X-Large";

    function serializeRegistrationJson() {
        return {
            eventId: $scope.eventId,
            badgeLine1: $scope.badgeLine1,
            badgeLine2: $scope.badgeLine2,
            meetAndGreet: $scope.meetAndGreet,
            ageVerification: $scope.ageVerification,
            tShirtSize: $scope.tShirtSize,
            comments: $scope.comments,
            type: 'afol',
            discountDate: $scope.eventDetails.discountDate,
            eventCost: $scope.eventDetails.cost,
            eventDiscount: $scope.eventDetails.discount,
            meetAndGreetCost: $scope.eventDetails.meetAndGreetCost,
            meetAndGreetDiscount: $scope.eventDetails.meetAndGreetDiscount,
            tShirtCost: $scope.eventDetails.tShirtCost,
            tShirtDiscount: $scope.eventDetails.tShirtDiscount
        }
    }

    $scope.submitRegistration = function() {
        $scope.verifying = true;
        eventRegistration.create(serializeRegistrationJson()).then(function(response) {
            $location.path('/afol/eventPayment.html');
        }, function() {
            $scope.verifying = false;
            $scope.displayMessage = "There was an error submitting your data. Please try again.";
            $scope.success = false;
            $scope.timer = true;
        });
    }

    EventDetails.get($scope.eventId).then(function(data) {
        $scope.eventDetails=data.data;
        $scope.discountDate = moment($scope.eventDetails.discountDate).format('MMMM Do, YYYY');
    });

    EventDates.getPassType($scope.eventId).then(function(passType) {
        $scope.passType = passType;
    });

    EventDates.getPassDates($scope.eventId).then(function(passDates) {
        $scope.passDates = passDates;
    });

    EventDates.getMeetAndGreetDinnerDate($scope.eventId).then(function(meetAndGreetDinnerDate) {
        $scope.meetAndGreetDinnerDate = meetAndGreetDinnerDate;
    });

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }
}])
.controller('afolEventThemes', ['$scope', '$location', 'Themes', function($scope, $location, Themes) {
    $("#splashPageCTA").hide();
    $scope.eventId = 2;
    $scope.themeList = [];


    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }

    Themes.get($scope.eventId).then(function(data) {
        $scope.themeList = data;
    });
}])
.controller('afolMe', ['$scope', '$location', 'Auth', 'EventRegistration', 'EventDates', function($scope, $location, Auth, EventRegistration, EventDates) {
    $("#splashPageCTA").hide();
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.timer = false;
    $scope.success = true;
    $scope.passType = undefined;
    $scope.passDates = undefined;
    $scope.eventList = {}
    $scope.eventId = 2;

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

    EventDates.getPassType($scope.eventId).then(function(passType) {
        $scope.passType = passType;
    });

    EventDates.getPassDates($scope.eventId).then(function(passDates) {
        $scope.passDates = passDates;
    });
}])
.controller('afolAdmin', ['$scope', '$location', function($scope, $location) {
    $("#splashPageCTA").hide();

    $scope.clickRegistrations = function() {
        $location.path('/afol/admin/registeredAfols.html');
    }
}])
.controller('adminRegisteredAfols', ['$scope', 'RegisteredAfols', 'RegistrationLineItems', function($scope, RegisteredAfols, RegistrationLineItems) {
    $("#splashPageCTA").hide();
    $scope.registeredAfols = undefined;
    $scope.eventId = 2;
    $scope.eventName = undefined;

    RegisteredAfols.get($scope.eventId).then(function(data) {
        $scope.registeredAfols = data[$scope.eventId]['registeredAfols'];
        $scope.eventName = data[$scope.eventId]['eventName'];
    });

    $scope.confirmPayment = function(lineItem) {
        var self = this;
        if (lineItem.paid === 'YES') {
            lineItem.paid = 'NO';
            RegistrationLineItems.revokePayment(lineItem.registrationLineItemId,this.afol.registrationId).then(function(data) {
                self.afol.paid = 'NO';
            });
        } else {
            lineItem.paid = 'YES';
            RegistrationLineItems.confirmPayment(lineItem.registrationLineItemId, this.afol.registrationId).then(function(data) {
                self.afol.paid = data.registrationPaid ? 'YES' : 'NO';
            });
        }
    }
}])
.controller('afolIndex', ['$scope', '$location', 'GetAfolMocList', '$window', 'EventDates', 'EventRegistration', function($scope, $location, GetAfolMocList, $window, EventDates, EventRegistration) {
    $("#splashPageCTA").hide();
    $scope.mocCount = 0;
    $scope.vendorCount = 0;
    $scope.mocList = [];
    $scope.userName = $window.sessionStorage.firstName + "'s Site";
    $scope.isRegistered = false;

    EventDates.getEventYear(2).then(function(year) {
        $scope.eventYear = year;
    });

    EventDates.getEventMonthYear(2).then(function(monthYear) {
        $scope.eventMonthYear = monthYear;
    });

    EventRegistration.get().then(function(data) {
        $scope.isRegistered = (Object.keys(data).length ? true : false);
    });

    $scope.clickMe = function() {
        $location.path("/afol/eventMe.html");
    }

    $scope.clickThemes = function() {
        $location.path("/afol/eventThemes.html");
    }

    $scope.clickGames = function() {
        //$location.path("/afol/eventGames.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickRegistration = function() {
        if ($scope.isRegistered) {
            $location.path("/afol/eventMe.html");
        } else {
            $location.path("/afol/2/eventRegistration.html");
        }
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
