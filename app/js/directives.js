'use strict';

/* Directives */
angular.module('brickSlopes.directives', [])
.directive('bsHeader', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/header.html'
    }
})
.directive('bsLogo', ['BrickSlopesText', '$sce', function(brickSlopesText, $sce) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fontColor: '@',
            fontSize: '@',
            text: '@'
        },
        template: '<span ng-bind-html="bsText"></span>',
        link: function(scope, element, attrs) {
            scope.bsText = $sce.trustAsHtml(
                brickSlopesText.createText('Brick', scope.fontSize, scope.fontColor, undefined) +
                brickSlopesText.createText('Slopes', scope.fontSize, scope.fontColor, undefined)
            );
            scope.$watch("text", function() {
                if (angular.isDefined(scope.text)) {
                    scope.bsText = $sce.trustAsHtml(
                        brickSlopesText.createText('Brick', scope.fontSize, scope.fontColor, undefined) +
                        brickSlopesText.createText('Slopes', scope.fontSize, scope.fontColor, undefined) + ' ' +
                        (scope.text ? brickSlopesText.createText(scope.text, scope.fontSize, scope.fontColor, undefined) : "")
                    );
                }
            });
        }
    }
}])
.directive('bsText', ['BrickSlopesText', '$sce',  function(brickSlopesText, $sce) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fontColor: '@',
            fontSize: '@',
            text: '@'
        },
        template: '<span ng-bind-html="bsText"></span>',
        link: function(scope, element, attrs) {
            scope.$watch("text", function() {
                scope.bsText = $sce.trustAsHtml(brickSlopesText.createText(attrs.text, attrs.fontSize, attrs.fontColor));
            });
        }
    }
}])
.directive('bsFooter', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/footer.html'
    }
})
.directive('equals', function() {
    /*
        A big thanks to Jan laussman
        http://stackoverflow.com/questions/14012239/password-check-directive-in-angularjs
    */
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function(val) {
                validate();
            });

            var validate = function() {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', val1 === val2);
            };
        }
    }
})
/*LOGIN*/
.directive('bsLoginForm', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/loginForm.html'
    }
})
.directive('bsSignupForm', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/signUpForm.html',
    }
})
.directive('bsResetPassword', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/resetPasswordForm.html',
    }
})
.directive('bsSignupText', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/signUpText.html'
    }
})
.directive('bsRegisteredEvents', function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'partials/afol/eventPanes/registeredEvents.html'
    }
})
.directive('bsEventRegistrationCta', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/afol/eventPanes/registerEventsCTA.html'
    }
})
.directive('bsTheme', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/afol/eventThemesDirective.html',
        link: function(scope, element, attrs) {
            scope.color = attrs.color;
        }
    }
});
