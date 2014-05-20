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
    .directive('bsLogo', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                fontColor: '@',
                fontSize: '@'
            },
            template: '<span class="{{fontColor}}Font bold">' +
                '<span style="{{capsFont}}">B</span>' +
                '<span style="{{smallFont}}">RICK</span>' +
                '<span style="{{capsFont}}">S</span>' +
                '<span style="{{smallFont}}">LOPES</span>' +
                '</span>',
            link: function(scope, element, attrs) {
                scope.capsFont = "font-size: " + scope.fontSize + "em;";
                scope.smallFontNumber = parseInt(scope.fontSize * .8);
                scope.smallFont = "font-size: " + scope.smallFontNumber + "em;";
            }
        }
    })
    .directive('bsFooter', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/footer.html'
        }
    });
