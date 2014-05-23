'use strict';

/* Directives */
angular.module('brickSlopes.directives', [])
.directive('bsHeader', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/header.html'
    }
})
.directive('bsLogo', ['BrickSlopesText', '$sce', function(brickSlopesText, $sce) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fontColor: '@',
            fontSize: '@'
        },
        template: '<span ng-bind-html="bsText"></span>',
        link: function(scope, element, attrs) {
            scope.bsText = $sce.trustAsHtml(
                brickSlopesText.createText('Brick', scope.fontSize, scope.fontColor, undefined) +
                brickSlopesText.createText('Slopes', scope.fontSize, scope.fontColor, undefined)
            );
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
        templateUrl: 'partials/footer.html'
    }
});
