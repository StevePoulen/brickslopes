(function(angular) {
    'use strict';
    angular.module('brickSlopes').controller('vendorContactController', [
        '$scope',
        'vendorContactService',
        function (
            $scope,
            vendorContactService
        ) {
            setDefaultScopeVariables('LeGo1');
            $scope.timer = false;
            $scope.verifying = false;

            function setDefaultScopeVariables(captchaInit) {
                $scope.captchaInit = captchaInit;
                $scope.data = Object({
                    businessName: '',
                    contactName: '',
                    email: '',
                    phoneNumber: '',
                    typeOfProducts: 'Type of Products ...',
                    space: '',
                    associates: '',
                    webSite: '',
                    captcha: ''
                });
            }

            $scope.submitEmail = function () {
                $scope.verifying = true;
                vendorContactService.create($scope.data).then(function(response) {
                    $scope.vendorContactForm.$setPristine();
                    setDefaultScopeVariables('WylDstYl3');
                    $scope.displayMessage = 'Your e-mail has been sent.';
                    $scope.timer = true;
                    $scope.verifying = false;
                });
            }
        }
    ])
})(angular);
