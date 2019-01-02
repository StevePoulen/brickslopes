var showAfolLogin = true;

(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .controller('afolEventRegistration', [
        '$scope',
        '$location',
        'EventDetailsService',
        'EventRegistrationService',
        'EventDates',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            EventDetailsService,
            EventRegistrationService,
            EventDates,
            EventSelectionFactory
        ) {
            $scope.displayRegistrationForm = false;
            $scope.displayVIBMaster = true;
            $scope.displayVIB = true;
            $scope.displayStarWars = true;

            $scope.verifying = false;
            $scope.displayMessage = "";
            $scope.success = true;
            $scope.timer = false;
            $scope.registrationId = undefined;
            $scope.eventId = EventSelectionFactory.getSelectedEvent();
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
                        draftOneId: $scope.draftOneId,
                        draftTwoId: $scope.draftTwoId,
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
                EventRegistrationService.submitRegistration($scope.isCreate, serializeRegistrationJson()).then(function(response) {
                    $location.path('/registered/eventPayment.html');
                }, function() {
                    $scope.verifying = false;
                    $scope.displayMessage = "There was an error submitting your data. Please try again.";
                    $scope.success = false;
                    $scope.timer = true;
                });
            }

            EventDetailsService.getV2().then(function(data) {
                console.log(data)
                $scope.eventDetails=data;
                $scope.discountDate = data.formattedDiscountDate;
                $scope.draftOneId = data.draftOneId;
                $scope.draftTwoId = data.draftTwoId;
            });

            EventDates.getPassType().then(function(passType) {
                $scope.passType = passType;
            });

            EventDates.getPassDates().then(function(passDates) {
                $scope.passDates = passDates;
            });

            EventDates.getEventYear().then(function(eventYear) {
                $scope.eventYear = eventYear;
            });

            EventDates.getMeetAndGreetDinnerDate().then(function(meetAndGreetDinnerDate) {
                $scope.meetAndGreetDinnerDate = meetAndGreetDinnerDate;
            });

            $scope.closeDialog = function() {
                $location.path("/registered/index.html");
            };

            $scope.registerVIBMaster = function() {
                $scope.displayVIBMaster = true;
                $scope.displayStarWars = false;
                $scope.displayVIB = false;
                $scope.displayRegistrationForm = true;
            };

            $scope.registerVIB = function() {
                $scope.displayVIBMaster = false;
                $scope.displayStarWars = false;
                $scope.displayVIB = true;
                $scope.displayRegistrationForm = true;
            };

            $scope.registerStarWars = function() {
                $scope.displayVIBMaster = false;
                $scope.displayStarWars = true;
                $scope.displayVIB = false;
                $scope.displayRegistrationForm = true;
            };

            EventRegistrationService.get().then(function(data) {
                var isRegistered = (Object.keys(data).length ? true : false);
                if (isRegistered) {
                    $scope.isCreate = false;
                    deSerializeRegistrationJson(data[$scope.eventId]);
                }
            });
        }
    ])
})(angular);
