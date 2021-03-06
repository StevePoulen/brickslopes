(function(angular) {    
    'use strict';
    angular.module('brickSlopes').controller('afolAdmin', [
        '$scope',
        '$location',
        'UserDetails',
        'RegisteredAfols',
        'MocDetails',
        'RegisteredGames',
        function(
            $scope,
            $location,
            UserDetails,
            RegisteredAfols,
            MocDetails,
            RegisteredGames
        ) {
            $scope.userCount = 0;
            $scope.registeredCount = 0;
            $scope.mocCount = 0;
            $scope.gamesCount = 0;

            UserDetails.getCount().then(function(data) {
                $scope.userCount = data;
            });

            RegisteredAfols.getCount().then(function(data) {
                $scope.registeredCount = data;
            });

            MocDetails.getCount().then(function(data) {
                $scope.mocCount = data;
            });

            RegisteredGames.getCount().then(function(data) {
                $scope.gamesCount = data;
            });

            $scope.clickFeedback = function() {
                $location.path('/admin/feedback.html');
            }

            $scope.clickRegistrations = function() {
                $location.path('/admin/registeredAfols.html');
            }

            $scope.clickGames= function() {
                $location.path('/admin/registeredGames.html');
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

            $scope.clickSiteNewsEmail = function() {
                $location.path('/admin/previewSiteNews/emails');
            }

            $scope.clickEventDates = function() {
                $location.path('/admin/registeredEventDates');
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
        }
    ]);
})(angular);
