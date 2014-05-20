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
  .directive('bsFooter', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/footer.html'
    }
  });
