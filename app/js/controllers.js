'use strict';

var showAfolLogin = false;

/* Controllers */
angular.module('brickSlopes.controllers', ['brickSlopes.services', 'ngRoute'])
.controller('bsIndex', ['$scope', '$location', 'EventDates', function($scope, $location, EventDates) {
    $scope.eventYear = '2014';
    $scope.publicEventDates = undefined;
    $scope.publicDateList = [];

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
.controller('bsFeedback', ['$scope', 'Feedback', function($scope, Feedback) {
    $scope.feedbackOpen = false;
    setDefaultFeedbackVariables('D@rKGr3y');
    $scope.timer = false;
    $scope.verifying = false;

    function feedbackAction() {
        if ($scope.feedbackOpen) {
            $( ".feedbackPanel" ).animate({ "left": "-=426px" }, "slow" );
        } else {
            $( ".feedbackPanel" ).animate({ "left": "+=426px" }, "slow" );
        }
        $('.mask').toggle();
        $scope.feedbackOpen = ! $scope.feedbackOpen;
    }

    $scope.clickMask = function() {
        feedbackAction();
    }

    $scope.clickFeedbackTab = function() {
        feedbackAction();
    }

    function serializeFeedbackJson() {
        return {
            email: $scope.email,
            feedback: $scope.feedback
        }
    }

    function setDefaultFeedbackVariables(captchaInit) {
        $scope.email = "";
        $scope.feedback = "";
        $scope.captchaInit = captchaInit;
        $scope.captcha= "";
    }

    $scope.submitFeedback = function() {
        $scope.verifying = true;
        Feedback.create(serializeFeedbackJson()).then(function(response) {
            $scope.feedbackForm.$setPristine();
            setDefaultFeedbackVariables('B#tm@n');
            $scope.displayMessage = "Your feedback has been received.";
            $scope.verifying = false;
            $scope.timer = true;
        });
    }
}])
.controller('emailUs', ['$scope', 'EmailUs', function($scope, EmailUs) {
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
    if ($window.sessionStorage.admin === 'YES') {
        $scope.showAfolLogin = true;
    }
    $scope.clickBuilder = function() {
        if ($window.sessionStorage.token) {
            $location.path("/registered/index.html");
        } else {
            $location.path("/registered/login.html");
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
        $location.path("/registered/login.html");
    }

    $scope.authenticated = function() {
        return ($window.sessionStorage.token ? true : false);
    }

    $scope.admin = function() {
        return ($window.sessionStorage.admin == 'YES' ? true : false);
    }
}])
.controller('afolLogin', ['$scope', '$location', 'Auth', '$window', 'UserDetails', function($scope, $location, Auth, $window, UserDetails) {
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
            storeSession($window, response);
            if($window.sessionStorage.redirectUrl) {
                if(($window.sessionStorage.redirectUrl).match('\/partials\/registered/*')) {
                    var newRedirectUrl = $window.sessionStorage.redirectUrl.replace('\/partials', '');
                    $location.path(newRedirectUrl);
                }
                delete $window.sessionStorage.redirectUrl;
            } else {
                $location.path('/registered/index.html');
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
            storeSession($window, response);
            $location.path('/registered/index.html');
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
        $location.path("/registered/index.html");
    }
}])
.controller('afolEventRegistration', ['$scope', '$location', 'EventDetails', 'EventRegistration', '$route', 'EventDates', function($scope, $location, EventDetails, EventRegistration, $route, EventDates) {
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.success = true;
    $scope.timer = false;
    $scope.registrationId = undefined;
    $scope.eventId = $route.current.params.eventId;
    $scope.eventDetails = {city: 'loading'};
    $scope.nameBadge = 'NO';
    $scope.meetAndGreet = 'YES';
    $scope.draftOne = 'YES';
    $scope.draftTwo = 'YES';
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
        $scope.draftOne = data.draftOne,
        $scope.draftTwo = data.draftTwo,
        $scope.ageVerification = data.ageVerification,
        $scope.tShirtSize = data.tShirtSize,
        $scope.comments = data.comments
    }

    function serializeRegistrationJson() {
        try {
            return {
                registrationId: $scope.registrationId,
                eventId: $scope.eventId,
                badgeLine1: $scope.eventYear + " BrickSlopes",
                badgeLine2: $scope.badgeLine2,
                badgeLine3: $scope.badgeLine3,
                nameBadge: $scope.nameBadge,
                meetAndGreet: $scope.meetAndGreet,
                draftOne: $scope.draftOne,
                draftTwo: $scope.draftTwo,
                ageVerification: $scope.ageVerification,
                tShirtSize: $scope.tShirtSize,
                comments: $scope.comments,
                type: 'afol',
                discountDate: $scope.eventDetails.discountDate,
                isOwner: 'YES'
            }
        } catch (err) {
            return {};
        }
    }

    $scope.submitRegistration = function() {
        $scope.verifying = true;
        EventRegistration.submitRegistration($scope.isCreate, serializeRegistrationJson()).then(function(response) {
            $location.path('/registered/eventPayment.html');
        }, function() {
            $scope.verifying = false;
            $scope.displayMessage = "There was an error submitting your data. Please try again.";
            $scope.success = false;
            $scope.timer = true;
        });
    }

    EventDetails.get($scope.eventId).then(function(data) {
        $scope.eventDetails=data;
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
        $location.path("/registered/index.html");
    }

    EventRegistration.get().then(function(data) {
        var isRegistered = (Object.keys(data).length ? true : false);
        if (isRegistered) {
            $scope.isCreate = false;
            deSerializeRegistrationJson(data[$scope.eventId]);
        }
    });
}])
.controller('afolEventVendors', ['$scope', '$location', 'VendorDetails', '$route', function($scope, $location, VendorDetails , $route) {
    $scope.eventId = $route.current.params.eventId;
    $scope.vendorList = [];

    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }

    VendorDetails.getList($scope.eventId).then(function(data) {
        $scope.vendorList = data;
    });
}])
.controller('afolEventGames', ['$scope', '$location', 'Games', function($scope, $location, Games) {
    $scope.eventId = 2;
    $scope.gameList = [];
    $scope.userGameList = [];
    $scope.showModal = false;
    $scope.verifying = false;

    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }

    Games.getList($scope.eventId).then(function(data) {
        $scope.gameList = data;
    });

    Games.getUserGameList($scope.eventId).then(function(data) {
        $scope.userGameList = data;
    });

    function serializeGameRegistrationJson($gameId) {
        return {
            eventId: $scope.eventId,
            gameId: $gameId,
            type: 'PARTICIPANT'
        }
    }

    $scope.clickGameRegistration = function() {
        $scope.verifying = true;
        var self = this;
        Games.gameRegistration(serializeGameRegistrationJson(self.game.gameId)).then(function(status) {
            self.isRegistered = true;
            if (status === 201) {
                $scope.verifying = false;
                if (self.game.fee === 'YES') {
                    $location.path('/registered/eventPayment.html');
                } else {
                    $scope.showModal = true;
                }
            }
        }, function(status) {
            $scope.verifying = false;
            if (status === 400) {
                $scope.displayErrorMessage = "The Game travails.";
            }
        });
    };

    $scope.clickGameDeletion = function() {
        $scope.verifying = true;
        var self = this;
        Games.gameDeletion($scope.eventId, self.game.gameId).then(function(status) {
            self.isRegistered = false;
            if (status === 200) {
                $scope.showModal = true;
                $scope.verifying = false;
            }
        }, function(status) {
            $scope.verifying = false;
            if (status === 400) {
                $scope.displayErrorMessage = "The Game travails.";
            }
        });
    };
}])
.controller('afolEventThemes', ['$scope', '$location', 'Themes', function($scope, $location, Themes) {
    $scope.eventId = 2;
    $scope.themeList = [];


    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }

    Themes.getList($scope.eventId).then(function(data) {
        $scope.themeList = data;
    });
}])
.controller('afolMe', ['$scope', '$location', 'Auth', 'EventRegistration', 'EventDates', 'UserDetails', 'MocDetails', 'Games', 'VendorDetails', function($scope, $location, Auth, EventRegistration, EventDates, UserDetails, MocDetails, Games, VendorDetails) {
    $scope.verifying = false;
    $scope.displayMessage = "";
    $scope.timer = false;
    $scope.success = true;
    $scope.eventList = {};
    $scope.mocList = {};
    $scope.vendorModel = {};
    $scope.mocCount = 0;
    $scope.gameCount = 0;
    $scope.userGameList = {};
    $scope.userObject = {};
    $scope.eventId = 2;
    $scope.displayRegisterEventCTA = true;
    $scope.displayRegisterEventMocsCTA = true;
    $scope.displayRegisterEventGamesCTA = true;
    $scope.displayRegisterEventVendorsCTA = true;

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
        $location.path('/registered/eventPayment.html');
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

    $scope.clickEditProfile = function() {
        $location.path("/registered/editProfile.html");
    }

    $scope.clickRegistration = function() {
        $location.path("/registered/" + $scope.eventId + "/eventRegistration.html");
    }

    $scope.clickMocRegistration = function() {
        if (UserDetails.isUserPaid()) {
            $location.path("/paid/" + $scope.eventId + "/eventMocRegistration.html");
        }
    }

    $scope.clickUpdateMocRegistration = function() {
        if (UserDetails.isUserPaid()) {
            $location.path("/paid/" + $scope.eventId + "/" + this.moc.mocId + "/eventMocRegistration.html");
        }
    }

    $scope.clickGames = function() {
        if (UserDetails.isUserPaid()) {
            $location.path("/paid/eventGames.html");
        }
    }

    $scope.clickVendors = function() {
        $location.path("/registered/" + $scope.eventId + "/" + $scope.storeId + "/vendorRegistration.html");
    }

    $scope.clickTables = function() {
        if ($scope.tableId) {
            updateTables();
        } else {
            addTables();
        }
    }

    function addTables() {
        $location.path("/registered/" + $scope.eventId + "/" + $scope.storeId+ "/tableRegistration.html");
    }

    function updateTables() {
        $location.path("/registered/" + $scope.eventId + "/" + $scope.tableId + "/updateTableRegistration.html");
    }

    $scope.clickAssociates = function() {
        $location.path("/registered/" + $scope.eventId + "/" + $scope.storeId + "/associateRegistration.html");
    }

    $scope.clickEditAssociate = function() {
    }

    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }

    function displayRegisterEventButton() {
        return Object.keys($scope.eventList).length;
    }

    function displayEventMocRegisterButton() {
        return Object.keys($scope.mocList).length && UserDetails.isUserRegistered() && UserDetails.isUserPaid();
    }

    function displayEventGamesRegisterButton() {
        return Object.keys($scope.userGameList).length && UserDetails.isUserRegistered() && UserDetails.isUserPaid();
    }

    function displayEventVendorRegisterButton() {
        return Object.keys($scope.vendorModel).length;
    }

    EventRegistration.get().then(function(data) {
        $scope.eventList = data;
        $scope.displayRegisterEventCTA = ! displayRegisterEventButton();
    });

    MocDetails.getListByUserId($scope.eventId).then(function(data) {
        $scope.mocList = data;
        $scope.displayRegisterEventMocsCTA = ! displayEventMocRegisterButton();
        MocDetails.getCountByUser($scope.eventId).then(function(data) {
            $scope.mocCount = data;
        });
    });

    VendorDetails.getEventMeVendorInformation($scope.eventId).then(function(data) {
        $scope.vendorModel = data;
        $scope.storeId = $scope.vendorModel.store.storeId;
        $scope.tableId = $scope.vendorModel.tables.tableId;
        $scope.displayRegisterEventVendorsCTA = ! displayEventVendorRegisterButton();
    });

    Games.getUserGameList($scope.eventId).then(function(data) {
        $scope.userGameList = data;
        $scope.displayRegisterEventGamesCTA = ! displayEventGamesRegisterButton();
        $scope.gameCount = Object.keys(data).length;
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
.controller('AssociateRegistration', ['$scope', '$location', 'VendorDetails', '$route', '$sce', function($scope, $location, VendorDetails, $route, $sce) {
    $scope.eventId = $route.current.params.eventId;
    $scope.storeId = $route.current.params.storeId;
    $scope.displayMessage = undefined;
    $scope.showModal = false;
    $scope.associates = [];
    setDefaultScopeVariables();

    function setDefaultScopeVariables() {
        $scope.firstName = undefined;
        $scope.lastName = undefined;
        $scope.email = undefined;
        $scope.addAfolPass = 'YES';
    }

    function serializeAssociateJson() {
        return {
            eventId: $scope.eventId,
            storeId: $scope.storeId,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email,
            addAfolPass: $scope.addAfolPass
        }
    }

    $scope.clickPayment = function() {
        $location.path('/registered/eventPayment.html');
    }

    function addAssociateToCollection(associate) {
        $scope.associates.push(
            {
                associateId: associate.associateId,
                firstName: associate.firstName,
                lastName: associate.lastName
            }
        )
    }

    $scope.submitAssociateRegistration = function() {
        $scope.verifying = true;
        VendorDetails.createAssociate(serializeAssociateJson()).then(function(data) {
            $scope.registrationForm.$setPristine();
            $scope.displayMessage = $sce.trustAsHtml("Your Associate Registration has been received.<p>Would you like to add another Associate or Continue to Payment?");
            $scope.verifying = false;
            $scope.showModal = true;
            $scope.modalTitle = 'Success';
            addAssociateToCollection(data);
            setDefaultScopeVariables();
        }, function(status) {
            $scope.verifying = false;
            $scope.modalTitle = 'Error';
            if (status == 412) {
                $scope.displayMessage = $sce.trustAsHtml("You may not add yourself as an associate of your own store.");
            } else {
                $scope.displayMessage = $sce.trustAsHtml("The Vendor Associate travails.");
            }
            $scope.showModal = true;
        });
    }

    $scope.closeDialog = function() {
        $location.path("/registered/eventPayment.html");
    }

    VendorDetails.getAssociates($scope.eventId, $scope.storeId).then(function(data) {
        $scope.associates = data;
    });
}])
.controller('vendorRegistration', ['$scope', '$location', 'VendorDetails', '$route', 'EventDetails', function($scope, $location, VendorDetails, $route, EventDetails) {
    $scope.eventId = $route.current.params.eventId;
    $scope.storeId = $route.current.params.storeId;
    $scope.isStoreUpdate = false;
    $scope.displayErrorMessage = undefined;
    setDefaultScopeVariables();
    $scope.buttonText = 'Register';

    function setDefaultScopeVariables() {
        $scope.name = undefined;
        $scope.description = undefined;
        $scope.url = 'https://<your_store_url>';
        $scope.logo = 'https://<your_logo_url>';
    }

    function serializeVendorJson() {
        return {
            eventId: $scope.eventId,
            storeId: $scope.storeId,
            name: $scope.name,
            description: $scope.description,
            url: $scope.url,
            logo: $scope.logo
        }
    }

    $scope.submitRegistration = function() {
        $scope.verifying = true;
        if ($scope.isStoreUpdate) {
            updateVendor();
        } else {
            createVendor();
        }
    }

    function createVendor() {
        VendorDetails.createStore(serializeVendorJson()).then(function(data) {
            $scope.verifying = false;
            $location.path('/registered/' + $scope.eventId + '/' + data.storeId + '/tableRegistration.html');
        }, function(status) {
            errorMessage(status);
        });
    }

    function updateVendor() {
        VendorDetails.updateStore(serializeVendorJson()).then(function(status) {
            if (status === 200) {
                $location.path('/registered/eventMe.html');
            }
            $scope.verifying = false;
        }, function(status) {
            errorMessage(status);
        });
    }

    function errorMessage(status) {
        $scope.verifying = false;
        if (status === 400) {
            $scope.displayErrorMessage = "The Vendor travails.";
        }
    }

    $scope.closeDialog = function() {
        $location.path("/registered/eventMe.html");
    }

    function setUpdateModel(vendor) {
        $scope.storeId = vendor.storeId;
        $scope.eventId = vendor.eventId;
        $scope.name = vendor.name;
        $scope.description = vendor.description;
        $scope.url = vendor.url;
        $scope.logo = vendor.logo;
    }

    $scope.$watch("storeId", function(storeId, old) {
        if (! $scope.called) {
            var storeIdRegex= /^\d+$/;
            if (
                angular.isDefined(storeId) &&
                storeIdRegex.test(storeId)
            ) {
                VendorDetails.getStore(storeId).then(function(store) {
                    if (store) {
                        $scope.isStoreUpdate = true;
                        $scope.buttonText = 'Update';
                        setUpdateModel(store);
                        $scope.called = true;
                    }
                });
            }
        }
    });
}])
.controller('TableRegistration', ['$scope', '$location', 'VendorDetails', '$route', 'EventDetails', function($scope, $location, VendorDetails, $route, EventDetails) {
    $scope.eventId = $route.current.params.eventId;
    $scope.storeId = $route.current.params.storeId;
    $scope.tableId = $route.current.params.tableId;
    $scope.isTableUpdate = false;
    setDefaultScopeVariables();
    $scope.buttonText = 'Register';
    $scope.tableRange = [1,2,3,4,5,6,7,8,9,10,11,12];

    EventDetails.get($scope.eventId).then(function(data) {
        $scope.tableCost = data.lineItems['10009'].cost;
        $scope.eventPass = data.lineItems['10000'].lineItem;
        $scope.eventName=data.name;
    });

    function setDefaultScopeVariables() {
        $scope.tables = 2;
    }

    function serializeTableJson() {
        return {
            eventId: $scope.eventId,
            storeId: $scope.storeId,
            tableId: $scope.tableId,
            tables: $scope.tables
        }
    }

    $scope.submitTableRegistration = function() {
        $scope.verifying = true;
        if ($scope.isTableUpdate) {
            updateTableOrder();
        } else {
            createTableOrder();
        }
    }

    function createTableOrder() {
        VendorDetails.createTableOrder(serializeTableJson()).then(function(data) {
            $scope.verifying = false;
            $location.path('/registered/' + $scope.eventId + '/' + data.storeId + '/associateRegistration.html');
        }, function(status) {
            errorMessage(status);
        });
    }

    function updateTableOrder() {
        VendorDetails.updateTableOrder(serializeTableJson()).then(function(status) {
            if (status === 200) {
                $location.path('/registered/eventMe.html');
            }
            $scope.verifying = false;
        }, function(status) {
            errorMessage(status);
        });
    }

    function errorMessage(status) {
        $scope.verifying = false;
        if (status === 400) {
            $scope.displayErrorMessage = "The Table travails.";
        }
    }

    $scope.closeDialog = function() {
        $location.path("/registered/eventMe.html");
    }

    function setUpdateModel(table) {
        $scope.storeId = table.storeId;
        $scope.eventId = table.eventId;
        $scope.tableId = table.tableId;
        $scope.tables = parseInt(table.tables);
    }

    $scope.$watch("tableId", function(tableId) {
        var tableIdRegex= /^\d+$/;
        if (
            angular.isDefined(tableId) &&
            tableIdRegex.test(tableId)
        ) {
            VendorDetails.getTableById(tableId).then(function(table) {
                if (table) {
                    $scope.isTableUpdate = true;
                    $scope.buttonText = 'Update';
                    setUpdateModel(table);
                }
            });
        }
    });
}])
.controller('afolMocRegistration', ['$scope', '$location', '$window', 'Themes', 'MocDetails', '$route', function($scope, $location, $window, Themes, MocDetails, $route) {
    $scope.firstName = $window.sessionStorage.firstName;
    $scope.lastName = $window.sessionStorage.lastName;
    setDefaultScopeVariables();
    $scope.width = buildRange(1,55);
    $scope.depth = buildRange(1,7);
    $scope.eventId = $route.current.params.eventId;
    $scope.mocId = $route.current.params.mocId;
    $scope.displayErrorMessage = undefined;
    $scope.displayMessage = undefined;
    $scope.showModal = false;
    $scope.isMocUpdate = false;
    $scope.buttonText = 'Register My MOC';

    function setDefaultScopeVariables() {
        $scope.mocId = undefined;
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

    Themes.getList($scope.eventId).then(function(data) {
        $scope.themeList = data;
        $scope.theme = $scope.themeList[0];
        $scope.themeId = $scope.theme.themeId;
    });

    function serializeMocJson() {
        return {
            mocId: $scope.mocId,
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
        if ($scope.isMocUpdate) {
            updateMoc();
        } else {
            createMoc();
        }
    }

    function createMoc() {
        MocDetails.create(serializeMocJson()).then(function(status) {
            if (status === 201) {
                $scope.registrationForm.$setPristine();
                setDefaultScopeVariables();
                $scope.showModal = true;
                MocDetails.expireCache($scope.eventId);
            }
            $scope.verifying = false;
        }, function(status) {
            errorMessage(status);
        });
    }

    function updateMoc() {
        MocDetails.update(serializeMocJson()).then(function(status) {
            if (status === 200) {
                $scope.registrationForm.$setPristine();
                setDefaultScopeVariables();
                $scope.showModal = true;
                MocDetails.expireCache($scope.eventId);
                $scope.isMocUpdate = false;
                $scope.buttonText = 'Register My MOC';
            }
            $scope.verifying = false;
        }, function(status) {
            errorMessage(status);
        });
    }

    function errorMessage(status) {
        $scope.verifying = false;
        if (status === 400) {
            $scope.displayErrorMessage = "The MOC travails.";
        }
    }

    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }

    function setUpdateModel(moc) {
        $scope.mocId = moc.mocId;
        $scope.themeId = moc.themeId;
        $scope.eventId = moc.eventId;
        $scope.title = moc.title;
        $scope.displayName = moc.displayName;
        $scope.mocImageUrl = moc.mocImageUrl;
        $scope.baseplateWidth = parseInt(moc.baseplateWidth);
        $scope.baseplateDepth = parseInt(moc.baseplateDepth);
        $scope.description = moc.description;
        Themes.getThemeObject($scope.eventId, moc.theme).then(function(theme) {
            $scope.theme = theme;
        });
    }

    $scope.$watch("mocId", function(mocId) {
        if (angular.isDefined(mocId)) {
            MocDetails.getMocById($scope.eventId, mocId).then(function(moc) {
                if (moc) {
                    $scope.isMocUpdate = true;
                    $scope.buttonText = 'Update My MOC';
                    setUpdateModel(moc);
                }
            });
        }
    });
}])
.controller('afolEditProfile', ['$scope', '$location', 'UserDetails', '$window', function($scope, $location, UserDetails, $window) {
    $scope.userObject = undefined;
    $scope.verifying = false;
    $scope.displayErrorMessage = "";

    $scope.closeDialog = function() {
        $location.path("/registered/eventMe.html");
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
            storeSession($window, response);
            $location.path('/registered/eventMe.html');
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
    $scope.type = "/controllers/admin/sendEmail.php?";
    $scope.type += "type=" + $route.current.params.emailType;
    $scope.type += "&userId=not_needed";

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('afolAdmin', ['$scope', '$location', 'UserDetails', 'RegisteredAfols', 'MocDetails', function($scope, $location, UserDetails, RegisteredAfols, MocDetails) {
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

    $scope.clickFeedback = function() {
        $location.path('/admin/feedback.html');
    }

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

    $scope.clickVendorRegistrationEmail = function() {
        $location.path('/admin/vendorRegistration/emails');
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
    $scope.registeredAfols = undefined;
    $scope.eventId = 2;
    $scope.eventName = undefined;

    RegisteredAfols.get($scope.eventId).then(function(data) {
        $scope.registeredAfols = data[$scope.eventId]['registeredAfols'];
        $scope.eventName = data[$scope.eventId]['eventName'];
    });

    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }
}])
.controller('adminRegisteredMocs', ['$scope', 'MocDetails', '$location', function($scope, MocDetails, $location) {
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
.controller('adminFeedback', ['$scope', 'Feedback', '$location', function($scope, Feedback, $location) {
    $scope.allFeedback = undefined;
    $scope.predicate = 'posted';
    $scope.reverse = false;

    Feedback.get().then(function(data) {
        $scope.allFeedback = data;
    });

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('adminRegisteredUsers', ['$scope', 'UserDetails', '$location', function($scope, UserDetails, $location) {
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

    function serializePaymentJson(lineItem, afol) {
        return {
            registrationLineItemId: lineItem.registrationLineItemId,
            registrationId: afol.registrationId,
            userId: afol.userId
        }
    }

    $scope.confirmPayment = function(lineItem) {
        var self = this;
        if (lineItem.paid === 'YES') {
            lineItem.paid = 'NO';
            RegistrationLineItems.revokePayment(
                serializePaymentJson(lineItem, self.afol)
            ).then(function(data) {
                self.afol.paid = 'NO';
            });
        } else {
            lineItem.paid = 'YES';
            RegistrationLineItems.confirmPayment(
                serializePaymentJson(lineItem, self.afol)
            ).then(function(data) {
                self.afol.paid = data.registrationPaid ? 'YES' : 'NO';
            });
        }
    }

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }
}])
.controller('afolIndex', ['$scope', '$location', 'MocDetails', 'Games', 'RegisteredAfols', '$window', 'EventDates', 'EventRegistration', 'UserDetails', 'Themes', 'VendorDetails', function($scope, $location, MocDetails, Games, RegisteredAfols, $window, EventDates, EventRegistration, UserDetails, Themes, VendorDetails) {
    $scope.mocCount = 0;
    $scope.mocList = [];
    $scope.vendorCount = 0;
    $scope.themeCount = 0;
    $scope.gameCount = 0;
    $scope.afolCount = 0;
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
        $location.path("/registered/eventMe.html");
    }

    function determineClickAction(finalPage) {
        if (! UserDetails.isUserRegistered()) {
            $scope.clickRegistration();
        } else if (! UserDetails.isUserPaid() ) {
            $location.path("/registered/eventPayment.html");
        } else {
            $location.path(finalPage);
        }
    }

    $scope.clickThemes = function() {
        determineClickAction("/paid/eventThemes.html");
    }

    $scope.clickGames = function() {
        determineClickAction("/paid/eventGames.html");
    }

    $scope.clickMocRegistration = function() {
        determineClickAction("/paid/" + $scope.eventId + "/eventMocRegistration.html");
    }

    $scope.clickMocList = function() {
        determineClickAction("/paid/eventMocList.html");
    }

    $scope.clickRegistration = function() {
        if ($scope.isRegistered) {
            $location.path("/registered/eventMe.html");
        } else {
            $location.path("/registered/" + $scope.eventId + "/eventRegistration.html");
        }
    }

    $scope.clickSchedule = function() {
        //$location.path("/registered/eventSchedule.html");
        $location.path("/registered/comingSoon.html");
    }

    $scope.clickKeynote = function() {
        //$location.path("/registered/eventKeynote.html");
        $location.path("/registered/comingSoon.html");
    }

    $scope.clickCollection = function() {
        //$location.path("/registered/eventCollection.html");
        $location.path("/registered/comingSoon.html");
    }

    $scope.clickVendors = function() {
        $location.path("/registered/" + $scope.eventId + "/eventVendors.html");
    }

    $scope.clickAfols= function() {
        $location.path("/registered/eventAfols.html");
    }

    $scope.clickFAQ = function() {
        $location.path("/registered/eventFAQ.html");
    }

    $scope.clickVenue = function() {
        $location.path("/registered/eventVenue.html");
    }

    $scope.clickHotel = function() {
        $location.path("/registered/eventHotel.html");
    }

    $scope.closeDialog = function() {
        $location.path("/registered/index.html");
    }

    MocDetails.getList($scope.eventId).then(function(data) {
        $scope.mocList = data;

        MocDetails.getCount($scope.eventId).then(function(data) {
            $scope.mocCount = data;
        });
    });

    VendorDetails.getCount($scope.eventId).then(function(data) {
        $scope.vendorCount = data;
    });

    Themes.getCount($scope.eventId).then(function(data) {
        $scope.themeCount = data;
    });

    Games.getCount($scope.eventId).then(function(data) {
        $scope.gameCount = data;
    });

    RegisteredAfols.getCount($scope.eventId).then(function(data) {
        $scope.afolCount = data;
    });
}]);
