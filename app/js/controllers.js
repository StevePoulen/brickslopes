var showAfolLogin = true;

(function(angular) {
    'use strict';
    angular.module('brickSlopes').controller('bsFeedback', ['$scope', 'Feedback', function($scope, Feedback) {
        $scope.feedbackOpen = false;
        setDefaultFeedbackVariables('D@rKGr3y');
        $scope.timer = false;
        $scope.verifying = false;

        function feedbackAction() {
            if ($scope.feedbackOpen) {
                $( ".feedbackPanel" ).animate({ "left": "-=400px" }, "slow" );
            } else {
                $( ".feedbackPanel" ).animate({ "left": "+=400px" }, "slow" );
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
    .controller('bsHeader', ['$scope', '$window', '$location', function($scope, $window, $location) {
        $scope.showAfolLogin = showAfolLogin;
        $scope.showHeader = true;
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

        if ($location.path() === '/schedule') {
            $scope.showHeader = false;
        }
    }])
    .controller('afolLogin', ['$scope', '$location', 'Auth', '$window', 'UserDetails', '$sce', function($scope, $location, Auth, $window, UserDetails, $sce) {
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
                        delete $window.sessionStorage.redirectUrl;
                        return;
                    }
                }

                $location.path('/registered/index.html');

                $scope.verifying = false;
            }, function() {
                $scope.verifying = false;
                $scope.displayMessage = $sce.trustAsHtml("The email or password you entered is incorrect.<p>");
                $scope.showModal = true;
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
                    $scope.displayMessage = $sce.trustAsHtml("The email is already in our system.<p>Please login using your e-mail and password.<p>If you have forgotten your password, please reset it.");
                    $scope.showModal = true;
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
                $scope.showModal = true;
                $scope.displayMessage = $sce.trustAsHtml("An e-mail with password reset information has been sent to your account.<p>Please check your spam filter too.");
            });
        }

        $scope.closeDialog = function() {
            $location.path("/");
        }
    }])
    .controller('afolEventPayment', [
        '$scope',
        '$location',
        'RegistrationLineItems',
        '$http',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            RegistrationLineItems,
            $http,
            EventSelectionFactory
        ) {
            $scope.registrationLineItems = undefined;
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
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

            RegistrationLineItems.get().then(function(data) {
                $scope.registrationLineItems = data[EventSelectionFactory.getSelectedEvent()]['lineItems'];
                $scope.totalAmount = data[EventSelectionFactory.getSelectedEvent()]['totalRemaining'];
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
        }
    ])
    .controller('afolEventVendors', [
        '$scope',
        '$location',
        'VendorDetails',
        '$route',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            VendorDetails,
            $route,
            EventSelectionFactory
        ) {
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
            $scope.vendorList = [];

            $scope.closeDialog = function() {
                $location.path("/registered/index.html");
            }

            $scope.clickVendors = function() {
                $location.path("/registered/" + $scope.eventId + "/undefined/vendorRegistration.html");
            }

            VendorDetails.getList().then(function(data) {
                $scope.vendorList = data;
            });
        }
    ])
    .controller('afolEventGames', [
        '$scope',
        '$location',
        'Games',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            Games,
            EventSelectionFactory
        ) {
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
            $scope.gameList = [];
            $scope.userGameList = [];
            $scope.showModal = false;
            $scope.verifying = false;

            $scope.closeDialog = function() {
                $location.path("/registered/index.html");
            }

            Games.getList().then(function(data) {
                $scope.gameList = data;
            });

            Games.getUserGameList().then(function(data) {
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
                Games.gameDeletion(self.game.gameId).then(function(status) {
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
        }
    ])
    .controller('afolEventThemes', [
        '$scope',
        '$location',
        'Themes',
        function(
            $scope,
            $location,
            Themes
        ) {
            $scope.publicList = [];
            $scope.afolList = [];
            $scope.bcsList = [];

            $scope.closeDialog = function() {
                $location.path("/registered/index.html");
            }

            Themes.getList().then(function(data) {
                _.forEach(data, function(theme) {
                    if (theme.type === 'BCS') {
                        $scope.bcsList.push(theme);
                    } else if (theme.type === 'PUBLIC') {
                        $scope.publicList.push(theme);
                    } else {
                        $scope.afolList.push(theme);
                    }
                });
            });
        }
    ])
    .controller('afolMe', [
        '$rootScope',
        '$scope',
        '$location',
        'Auth',
        'EventRegistrationService',
        'EventDates',
        'UserDetails',
        'MocDetails',
        'Games',
        'VendorDetails',
        'EventSelectionFactory',
        function(
            $rootScope,
            $scope,
            $location,
            Auth,
            EventRegistrationService,
            EventDates,
            UserDetails,
            MocDetails,
            Games,
            VendorDetails,
            EventSelectionFactory
        ) {
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
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
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

            $scope.clickTour = function() {
                $scope.closeDialog();
                $rootScope.$emit('show-tour');
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

            EventRegistrationService.get().then(function(data) {
                $scope.eventList = data;
                $scope.displayRegisterEventCTA = ! displayRegisterEventButton();
            });

            MocDetails.getListByUserId().then(function(data) {
                $scope.mocList = data;
                $scope.displayRegisterEventMocsCTA = ! displayEventMocRegisterButton();
                MocDetails.getCountByUser().then(function(data) {
                    $scope.mocCount = data;
                });
            });

            VendorDetails.getEventMeVendorInformation().then(function(data) {
                $scope.vendorModel = data;
                $scope.storeId = $scope.vendorModel.store.storeId;
                $scope.tableId = $scope.vendorModel.tables.tableId;
                $scope.displayRegisterEventVendorsCTA = ! displayEventVendorRegisterButton();
            });

            Games.getUserGameList().then(function(data) {
                $scope.userGameList = data;
                $scope.displayRegisterEventGamesCTA = ! displayEventGamesRegisterButton();
                $scope.gameCount = Object.keys(data).length;
            });

            UserDetails.getUser().then(function(data) {
                $scope.userObject = data;
                $scope.hideTour = UserDetails.isUserRegistered();
            });

            EventDates.getPassType().then(function(passType) {
                $scope.passType = passType;
            });

            EventDates.getPassDates().then(function(passDates) {
                $scope.passDates = passDates;
            });
        }
    ])
    .controller('AssociateRegistration', [
        '$scope',
        '$location',
        'VendorDetails',
        '$route',
        '$sce',
        'EventDetailsService',
        'EventDates',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            VendorDetails,
            $route,
            $sce,
            EventDetailsService,
            EventDates,
            EventSelectionFactory
        ) {
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
            $scope.storeId = $route.current.params.storeId;
            $scope.displayMessage = undefined;
            $scope.showModal = false;
            $scope.associates = [];
            setDefaultScopeVariables();

            EventDates.getPassType().then(function(passType) {
                $scope.passType = passType;
            });

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

            $scope.clickDelete = function() {
                var associateId = this.associate.associateId;
                var userId = this.associate.userId;
                VendorDetails.deleteAssociate({
                        associateId: associateId,
                        userId: userId
                }).then(function(status) {
                    deleteAssociateFromCollection(associateId);
                }, function(status) {

                });
            }

            function deleteAssociateFromCollection(associateId) {
                $scope.associates = _.filter($scope.associates, function(associate, index) {
                    return associate.associateId !== associateId;
                });
            }

            function addAssociateToCollection(associate) {
                $scope.associates.push({
                    associateId: associate.associateId,
                    userId: associate.userId,
                    firstName: associate.firstName,
                    lastName: associate.lastName,
                    lineItem: associate.lineItem === 'Event Pass' ? $scope.passType + ' Event Pass' : associate.lineItem
                })
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
                }, function(data) {
                    $scope.verifying = false;
                    $scope.modalTitle = 'Error';
                    if (data.error === 'selfie') {
                        $scope.displayMessage = $sce.trustAsHtml("You may not add yourself as an associate of your own store.");
                    } else if (data.error === 'existing registrar') {
                        $scope.displayMessage = $sce.trustAsHtml("This user is already registered to attend this event.");
                    } else {
                        $scope.displayMessage = $sce.trustAsHtml("The Vendor Associate travails.");
                    }
                    $scope.showModal = true;
                });
            }

            $scope.closeDialog = function() {
                $location.path("/registered/eventPayment.html");
            }

            VendorDetails.getAssociates($scope.storeId).then(function(data) {
                $scope.associates = data;
            });

            EventDetailsService.get().then(function(data) {
                $scope.formattedDiscountDate = data.formattedDiscountDate;
                $scope.vendorEventCost = data.lineItems['10012'].cost;
                $scope.vendorEventDiscount = data.lineItems['10012'].discount;
            });
        }
    ])
    .controller('vendorRegistration', [
        '$scope',
        '$location',
        'VendorDetails',
        '$route',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            VendorDetails,
            $route,
            EventSelectionFactory
        ) {
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
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
    .controller('TableRegistration', [
        '$scope',
        '$location',
        'VendorDetails',
        '$route',
        'EventDetailsService',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            VendorDetails,
            $route,
            EventDetailsService,
            EventSelectionFactory
        ) {
        $scope.eventId = EventSelectionFactory.getSelectedEvent();
        $scope.storeId = $route.current.params.storeId;
        $scope.tableId = $route.current.params.tableId;
        $scope.isTableUpdate = false;
        setDefaultScopeVariables();
        $scope.buttonText = 'Register';
        $scope.tableRange = [1,2,3,4,5,6,7,8,9,10,11,12];

        EventDetailsService.get().then(function(data) {
            $scope.firstTableCost = data.lineItems['10009'].cost;
            $scope.additionalTableCost = data.lineItems['10011'].cost;
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

        UserDetails.getUser().then(function(data) {
            $scope.userObject = data;
        });
    }])
    .controller('adminEmail', [
        '$scope',
        '$location',
        '$route',
        'GetEmailHtml',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            $route,
            GetEmailHtml,
            EventSelectionFactory
        ) {
            $scope.type = "/controllers/admin/sendEmail.php?";
            $scope.type += "type=" + $route.current.params.emailType;
            $scope.type += "&userId=not_needed";
            $scope.type += "&eventId=" + EventSelectionFactory.getSelectedEvent();

            $scope.closeDialog = function() {
                $location.path("/admin/index.html");
            }
        }
    ])
    .controller('eventAfols', [
        '$scope',
        'RegisteredAfols',
        '$location',
        'EventSelectionFactory',
        function(
            $scope,
            RegisteredAfols,
            $location,
            EventSelectionFactory
        ) {
            $scope.registeredAfols = undefined;
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
            $scope.eventName = undefined;

            RegisteredAfols.get().then(function(data) {
                $scope.registeredAfols = data[$scope.eventId]['registeredAfols'];
                $scope.eventName = data[$scope.eventId]['eventName'];
            });

            $scope.closeDialog = function() {
                $location.path("/registered/index.html");
            }
        }
    ])
    .controller('adminRegisteredMocs', ['$scope', 'MocDetails', '$location', function($scope, MocDetails, $location) {
        $scope.registeredMocs = undefined;
        $scope.predicate = 'firstName';
        $scope.reverse = false;

        MocDetails.getList().then(function(data) {
            $scope.registeredMocs = data;
        });

        $scope.closeDialog = function() {
            $location.path("/admin/index.html");
        }

        $scope.printMocs = function() {
            $location.path("/admin/printRegisteredMocs");
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
    .controller('adminRegisteredAfols', [
        '$scope',
        'RegisteredAfols',
        'RegistrationLineItems',
        '$location',
        'EventSelectionFactory',
        function(
            $scope,
            RegisteredAfols,
            RegistrationLineItems,
            $location,
            EventSelectionFactory
        ) {
            $scope.registeredAfols = undefined;
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
            $scope.eventName = undefined;
            $scope.predicate = 'firstName';
            $scope.reverse = false;
            $scope.showModal = false;
            
            $scope.isTShirt = function(lineItem) {
                return lineItem.lineItemCode === '10001';
            }
            
            $scope.isBadge = function(lineItem) {
                return lineItem.lineItemCode === '10004' ||
                    lineItem.lineItemCode === '10005'
            }

            RegisteredAfols.get().then(function(data) {
                $scope.registeredAfols = data[$scope.eventId]['registeredAfols'];
                $scope.eventName = data[$scope.eventId]['eventName'];
            });

            $scope.showEmailOption = function() {
                return (this.afol.paid === 'YES' ? true : false);
            }

            $scope.sendEmail = function() {
                RegisteredAfols.sendPaymentEmail(this.afol.userId);
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
        }
    ])
    .controller('afolIndex', [
        '$rootScope',
        '$scope',
        '$location',
        'MocDetails',
        'Games',
        'RegisteredAfols',
        '$window',
        'EventDates',
        'EventRegistrationService',
        'UserDetails',
        'Themes',
        'VendorDetails',
        'EventSelectionFactory',
        function(
            $rootScope,
            $scope,
            $location,
            MocDetails,
            Games,
            RegisteredAfols,
            $window,
            EventDates,
            EventRegistrationService,
            UserDetails,
            Themes,
            VendorDetails,
            EventSelectionFactory
        ) {
            $scope.mocCount = 0;
            $scope.mocList = [];
            $scope.vendorCount = 0;
            $scope.themeCount = 0;
            $scope.gameCount = 0;
            $scope.afolCount = 0;
            $scope.userName = $window.sessionStorage.firstName + "'s Site";
            $scope.isRegistered = false;
            $scope.eventId = EventSelectionFactory.getSelectedEvent();

            EventDates.getEventYear().then(function(year) {
                $scope.eventYear = year;
            });

            EventDates.getEventMonthYear().then(function(monthYear) {
                $scope.eventMonthYear = monthYear;
            });

            EventRegistrationService.get().then(function(data) {
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

            $scope.clickStarWars = function() {
                determineClickAction("/paid/starWarsFlyIn.html");
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
                $location.path("/registered/eventSchedule.html");
                //$location.path("/registered/comingSoon.html");
            }

            $scope.clickKeynote = function() {
                $location.path("/registered/eventKeynote.html");
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

            UserDetails.getUser().then(function(user) {
                UserDetails.hideTour().then(function(hideTour) {
                    if(! hideTour && UserDetails.tourStarted()) {
                        $rootScope.$emit('show-tour');
                    }
                });
            });

            MocDetails.getList().then(function(data) {
                $scope.mocList = data;

                MocDetails.getCount().then(function(data) {
                    $scope.mocCount = data;
                });
            });

            VendorDetails.getCount().then(function(data) {
                $scope.vendorCount = data;
            });

            Themes.getCount().then(function(data) {
                $scope.themeCount = data;
            });

            Games.getCount().then(function(data) {
                $scope.gameCount = data;
            });

            RegisteredAfols.getCount().then(function(data) {
                $scope.afolCount = data;
            });
        }
    ]);
})(angular);
