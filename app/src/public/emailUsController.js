(function(angular) {
    'use strict';
    angular.module('brickSlopes').controller('emailUsController', [
        '$scope',
        'emailUsService',
        function (
            $scope,
            emailUsService
        ) {
            setDefaultScopeVariables("LeGo1");
            $scope.timer = false;
            $scope.verifying = false;

            function setDefaultScopeVariables(captchaInit) {
                $scope.firstName = "";
                $scope.lastName = "";
                $scope.email = "";
                $scope.comments = "Comments ...";
                $scope.captchaInit = captchaInit;
                $scope.captcha = "";
            }

            function serializeEmailUsJson() {
                return {
                    firstName: $scope.firstName,
                    lastName: $scope.lastName,
                    email: $scope.email,
                    comments: $scope.comments
                }
            }

            $scope.submitEmail = function () {
                $scope.verifying = true;
                emailUsService.create(serializeEmailUsJson()).then(function (response) {
                    $scope.emailUsForm.$setPristine();
                    setDefaultScopeVariables("WylDstYl3");
                    $scope.displayMessage = "Your e-mail has been sent.";
                    $scope.timer = true;
                    $scope.verifying = false;
                });
            }
        }
    ])
})(angular);
