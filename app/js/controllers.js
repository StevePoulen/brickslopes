'use strict';

var showAfolLogin = false;

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
    setDefaultScopeVariables("LeGo1");
    $scope.timer = false;
    $scope.verifying = false;

    function setDefaultScopeVariables(captchaInit) {
        $scope.firstName = "";
        $scope.lastName = "";
        $scope.email = "";
        $scope.comments = "Comments ...";
        $scope.captchaInit = captchaInit;
        $scope.captcha= "";
    }

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
            setDefaultScopeVariables("WylDstYl3");
            $scope.displayMessage = "Your e-mail has been sent.";
            $scope.timer = true;
            $scope.verifying = false;
        });
    }
}])
.controller('bsHeader', ['$scope', '$window', '$location', function($scope, $window, $location) {
    $scope.showAfolLogin = showAfolLogin;
    $scope.clickBuilder = function() {
        if ($window.sessionStorage.token) {
            $location.path("/afol/index.html");
        } else {
            $location.path("/afol/login.html");
        }
    }

    $scope.clickAdmin = function() {
        $location.path("/admin/index.html");
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
.controller('afolLogin', ['$scope', '$location', 'Auth', '$window', 'UserDetails', function($scope, $location, Auth, $window, UserDetails) {
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

    $scope.submitLogin = function() {
        $scope.verifying = true;
        Auth.login(serializeLoginJson()).then(function(response) {
            storeSession($window, response.data);
            if($window.sessionStorage.redirectUrl) {
                if(($window.sessionStorage.redirectUrl).match('\/partials\/afol/*')) {
                    var newRedirectUrl = $window.sessionStorage.redirectUrl.replace('\/partials', '');
                    $location.path(newRedirectUrl);
                }
                delete $window.sessionStorage.redirectUrl;
            } else {
                $location.path('/afol/index.html');
            }
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
        UserDetails.register(serializeRegisterJson()).then(function(response) {
            if (response.status === 201) {
                storeSession($window, response.data);
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
            if (lineItem.paid !== 'YES') {
                $scope.paypalPayload['item_name_' + lineItemCounter] = lineItem.lineItem;
                $scope.paypalPayload['amount_' + lineItemCounter] = lineItem.total;
                $scope.paypalPayload['shipping_' + lineItemCounter] = 0;
                lineItemCounter++;
            }
        });
        return $scope.paypalPayload;
    }

    RegistrationLineItems.get($scope.eventId).then(function(data) {
        $scope.registrationLineItems = data[$scope.eventId]['lineItems'];
        $scope.totalAmount = data[$scope.eventId]['totalRemaining'];
        createFormData();
    });

    function createFormData() {
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
    $scope.registrationId = undefined;
    $scope.eventId = $route.current.params.eventId;
    $scope.eventDetails = {city: 'loading'};
    $scope.nameBadge = 'NO';
    $scope.meetAndGreet = 'YES';
    $scope.comments = 'Comments ...';
    $scope.ageVerification = 'YES';
    $scope.discountDate = undefined;
    $scope.passDates = undefined;
    $scope.eventYear = undefined;
    $scope.passType = undefined;
    $scope.meetAndGreetDinnerDate = undefined;
    $scope.isCreate = true;
    $scope.shirtSizes = ['No Thanks', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'XXX-Large'];
    $scope.tShirtSize = "X-Large";

    $scope.$watchCollection("[badgeLine3, badgeLine2]", function() {
        if (angular.isDefined($scope.badgeLine3) || angular.isDefined($scope.badgeLine2)) {
            $scope.nameBadge = 'YES';
        } else if ($scope.badgeLine3 === undefined && $scope.badgeLine2 === undefined) {
            $scope.nameBadge = 'NO';
        }
    });

    $scope.$watch("nameBadge", function(currentValue, oldValue) {
        if (currentValue == 'NO') {
            $scope.badgeLine2 = undefined;
            $scope.badgeLine3 = undefined;
        }
    });

    function deSerializeRegistrationJson(data) {
        $scope.registrationId = data.registrationId,
        $scope.badgeLine2 = data.badgeLine2,
        $scope.badgeLine3 = data.badgeLine3,
        $scope.nameBadge = data.nameBadge,
        $scope.meetAndGreet = data.meetAndGreet,
        $scope.ageVerification = data.ageVerification,
        $scope.tShirtSize = data.tShirtSize,
        $scope.comments = data.comments
    }

    function serializeRegistrationJson() {
        return {
            registrationId: $scope.registrationId,
            eventId: $scope.eventId,
            badgeLine1: $scope.eventYear + " BrickSlopes",
            badgeLine2: $scope.badgeLine2,
            badgeLine3: $scope.badgeLine3,
            nameBadge: $scope.nameBadge,
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
        eventRegistration.submitRegistration($scope.isCreate, serializeRegistrationJson()).then(function(response) {
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

    EventDates.getEventYear($scope.eventId).then(function(eventYear) {
        $scope.eventYear = eventYear;
    });

    EventDates.getMeetAndGreetDinnerDate($scope.eventId).then(function(meetAndGreetDinnerDate) {
        $scope.meetAndGreetDinnerDate = meetAndGreetDinnerDate;
    });

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }

    eventRegistration.get().then(function(data) {
        var isRegistered = (Object.keys(data).length ? true : false);
        if (isRegistered) {
            $scope.isCreate = false;
            deSerializeRegistrationJson(data[$scope.eventId]);
        }
    });


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
.controller('afolMe', ['$scope', '$location', 'Auth', 'EventRegistration', 'EventDates', 'UserDetails', function($scope, $location, Auth, EventRegistration, EventDates, UserDetails) {
    $("#splashPageCTA").hide();
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.timer = false;
    $scope.success = true;
    $scope.passType = undefined;
    $scope.passDates = undefined;
    $scope.eventList = {};
    $scope.userObject = {};
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

    $scope.payNow = function() {
        $location.path('/afol/eventPayment.html');
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

    $scope.clickEditProfile = function(eventId) {
        $location.path("/afol/editProfile.html");
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

    UserDetails.get().then(function(data) {
        $scope.userObject = data;
    });

    EventDates.getPassType($scope.eventId).then(function(passType) {
        $scope.passType = passType;
    });

    EventDates.getPassDates($scope.eventId).then(function(passDates) {
        $scope.passDates = passDates;
    });
}])
.controller('afolMocRegistration', ['$scope', '$location', '$window', 'Themes', 'MocDetails', function($scope, $location, $window, Themes, MocDetails) {
    $("#splashPageCTA").hide();
    $scope.firstName = $window.sessionStorage.firstName;
    $scope.lastName = $window.sessionStorage.lastName;
    setDefaultScopeVariables();
    $scope.width = buildRange(1,55);
    $scope.depth = buildRange(1,7);
    $scope.eventId = 2;
    $scope.displayErrorMessage = undefined;
    $scope.displayMessage = undefined;
    $scope.showModal = false;

    function setDefaultScopeVariables() {
        $scope.displayName = $scope.firstName + " " + $scope.lastName;
        $scope.baseplateWidth = 1;
        $scope.baseplateDepth = 1;
        $scope.theme = ($scope.themeList ? $scope.themeList[0] : undefined);
        $scope.themeId = undefined;
        $scope.title = undefined;
        $scope.mocImageUrl = undefined;
        $scope.description = undefined;
    }

    $scope.$watch("theme", function(newTheme, oldTheme) {
        if (angular.isDefined(newTheme)) {
            $scope.themeId = newTheme.themeId;
        }
    });

    function buildRange(start, end) {
        var range = [];
        for(var i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    }

    Themes.get($scope.eventId).then(function(data) {
        $scope.themeList = data;
        $scope.theme = $scope.themeList[0];
        $scope.themeId = $scope.theme.themeId;
    });

    function serializeMocJson() {
        return {
            themeId: $scope.themeId,
            eventId: $scope.eventId,
            title: $scope.title,
            displayName: $scope.displayName,
            mocImageUrl: $scope.mocImageUrl,
            baseplateWidth: $scope.baseplateWidth,
            baseplateDepth: $scope.baseplateDepth,
            description: $scope.description
        }
    }

    $scope.submitRegistration = function() {
        $scope.verifying = true;
        MocDetails.create(serializeMocJson()).then(function(status) {
            if (status === 201) {
                $scope.registrationForm.$setPristine();
                setDefaultScopeVariables();
                $scope.showModal = true;
            }
            $scope.verifying = false;
        }, function(status) {
            $scope.verifying = false;
            if (status === 400) {
                $scope.displayErrorMessage = "The MOC travails.";
            }
        });
    }

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }
}])
.controller('afolEditProfile', ['$scope', '$location', 'UserDetails', '$window', function($scope, $location, UserDetails, $window) {
    $("#splashPageCTA").hide();
    $scope.userObject = undefined;
    $scope.verifying = false;
    $scope.displayErrorMessage = "";

    $scope.closeDialog = function() {
        $location.path("/afol/eventMe.html");
    }

    function serializeProfileJson() {
        return {
            firstName: $scope.userObject.firstName,
            lastName: $scope.userObject.lastName,
            email: $scope.userObject.email,
            address: $scope.userObject.address,
            city: $scope.userObject.city,
            state: $scope.userObject.state,
            zipcode: $scope.userObject.zipcode,
            phoneNumber: $scope.userObject.phoneNumber,
            flickr: $scope.userObject.flickr
        }
    }

    $scope.submitProfile = function() {
        $scope.verifying = true;
        UserDetails.update(serializeProfileJson()).then(function(response) {
            if (response.status === 201) {
                storeSession($window, response.data);
                $location.path('/afol/eventMe.html');
            }
            $scope.verifying = false;
        }, function(data) {
            $scope.verifying = false;
            if (data.status === 400 && data.data === 'Duplicate E-mail') {
                $scope.displayErrorMessage = "The email is already in our system.";
            }
        });
    }

    UserDetails.get().then(function(data) {
        $scope.userObject = data;
    });
}])
.controller('adminEmail', ['$scope', '$location', '$route', 'GetEmailHtml', function($scope, $location, $route, GetEmailHtml) {
    $("#splashPageCTA").hide();
    $scope.type = "/controllers/admin/sendEmail.php?";
    $scope.type += "type=" + $route.current.params.emailType;
    $scope.type += "&userId=not_needed";

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('afolAdmin', ['$scope', '$location', 'UserDetails', 'RegisteredAfols', 'MocDetails', function($scope, $location, UserDetails, RegisteredAfols, MocDetails) {
    $("#splashPageCTA").hide();
    $scope.userCount = 0;
    $scope.registeredCount = 0;
    $scope.mocCount = 0;
    $scope.eventId = 2;

    UserDetails.getCount().then(function(data) {
        $scope.userCount = data;
    });

    RegisteredAfols.getCount($scope.eventId).then(function(data) {
        $scope.registeredCount = data;
    });

    MocDetails.getCount($scope.eventId).then(function(data) {
        $scope.mocCount = data;
    });

    $scope.clickRegistrations = function() {
        $location.path('/admin/registeredAfols.html');
    }

    $scope.clickUsers = function() {
        $location.path('/admin/registeredUsers.html');
    }

    $scope.clickMocs = function() {
        $location.path('/admin/registeredMocs.html');
    }

    $scope.clickEventRegistrationEmail = function() {
        $location.path('/admin/eventRegistration/emails');
    }

    $scope.clickUserRegistrationEmail = function() {
        $location.path('/admin/userRegistration/emails');
    }

    $scope.clickRegistrationPaidEmail = function() {
        $location.path('/admin/registrationPaidDisplay/emails');
    }

    $scope.clickResetPasswordEmail = function() {
        $location.path('/admin/resetPassword/emails');
    }
}])
.controller('eventAfols', ['$scope', 'RegisteredAfols','$location', function($scope, RegisteredAfols, $location) {
    $("#splashPageCTA").hide();
    $scope.registeredAfols = undefined;
    $scope.eventId = 2;
    $scope.eventName = undefined;

    RegisteredAfols.get($scope.eventId).then(function(data) {
        $scope.registeredAfols = data[$scope.eventId]['registeredAfols'];
        $scope.eventName = data[$scope.eventId]['eventName'];
    });

    $scope.closeDialog = function() {
        $location.path("/afol/index.html");
    }
}])
.controller('adminRegisteredMocs', ['$scope', 'MocDetails', '$location', function($scope, MocDetails, $location) {
    $("#splashPageCTA").hide();
    $scope.registeredMocs = undefined;
    $scope.predicate = 'firstName';
    $scope.reverse = false;
    $scope.eventId = 2;

    MocDetails.getList($scope.eventId).then(function(data) {
        $scope.registeredMocs = data;
    });

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('adminRegisteredUsers', ['$scope', 'UserDetails', '$location', function($scope, UserDetails, $location) {
    $("#splashPageCTA").hide();
    $scope.registeredUsers = undefined;
    $scope.predicate = 'firstName';
    $scope.reverse = false;

    UserDetails.getAll().then(function(data) {
        $scope.registeredUsers = data;
    });

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('adminRegisteredAfols', ['$scope', 'RegisteredAfols', 'RegistrationLineItems', '$location', function($scope, RegisteredAfols, RegistrationLineItems, $location) {
    $("#splashPageCTA").hide();
    $scope.registeredAfols = undefined;
    $scope.eventId = 2;
    $scope.eventName = undefined;
    $scope.predicate = 'firstName';
    $scope.reverse = false;
    $scope.showModal = false;

    RegisteredAfols.get($scope.eventId).then(function(data) {
        $scope.registeredAfols = data[$scope.eventId]['registeredAfols'];
        $scope.eventName = data[$scope.eventId]['eventName'];
    });

    $scope.showEmailOption = function() {
        return (this.afol.paid === 'YES' ? true : false);
    }

    $scope.sendEmail = function() {
        RegisteredAfols.sendPaymentEmail(this.afol.userId, $scope.eventId);
        $scope.showModal = true;
    }

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

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('afolIndex', ['$scope', '$location', 'MocDetails', 'RegisteredAfols', '$window', 'EventDates', 'EventRegistration', 'UserDetails', function($scope, $location, MocDetails, RegisteredAfols, $window, EventDates, EventRegistration, UserDetails) {
    $("#splashPageCTA").hide();
    $scope.mocCount = 0;
    $scope.afolCount = 0;
    $scope.vendorCount = 0;
    $scope.mocList = [];
    $scope.userName = $window.sessionStorage.firstName + "'s Site";
    $scope.isRegistered = false;
    $scope.eventId = 2;

    EventDates.getEventYear($scope.eventId).then(function(year) {
        $scope.eventYear = year;
    });

    EventDates.getEventMonthYear($scope.eventId).then(function(monthYear) {
        $scope.eventMonthYear = monthYear;
    });

    EventRegistration.get().then(function(data) {
        $scope.isRegistered = (Object.keys(data).length ? true : false);
    });

    $scope.clickMe = function() {
        $location.path("/afol/eventMe.html");
    }

    $scope.clickThemes = function() {
        if (UserDetails.isUserRegistered()) {
            $location.path("/afol/eventThemes.html");
        }
    }

    $scope.clickGames = function() {
        if (UserDetails.isUserRegistered()) {
            //$location.path("/afol/eventGames.html");
            $location.path("/afol/comingSoon.html");
        }
    }

    $scope.clickMocRegistration = function() {
        if (UserDetails.isUserRegistered()) {
            $location.path("/afol/eventMocRegistration.html");
        }
    }

    $scope.clickMocList = function() {
        if (UserDetails.isUserRegistered()) {
            $location.path("/afol/eventMocList.html");
        }
    }


    $scope.clickRegistration = function() {
        if ($scope.isRegistered) {
            $location.path("/afol/eventMe.html");
        } else {
            $location.path("/afol/" + $scope.eventId + "/eventRegistration.html");
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

    $scope.clickVendors = function() {
        //$location.path("/afol/eventVendors.html");
        $location.path("/afol/comingSoon.html");
    }

    $scope.clickAfols= function() {
        $location.path("/afol/eventAfols.html");
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

    MocDetails.getList($scope.eventId).then(function(data) {
        $scope.mocList = data;

        MocDetails.getCount($scope.eventId).then(function(data) {
            $scope.mocCount = data;
        });
    });

    RegisteredAfols.getCount($scope.eventId).then(function(data) {
        $scope.afolCount = data;
    });
}]);
