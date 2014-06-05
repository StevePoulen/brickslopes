'use strict';

/* jasmine specs for app go here */

describe('app', function() {
    beforeEach (
        module (
            'brickSlopes'
        )
    );

    var scope, ctrl;
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('Authentication', function() {
        describe('Login', function() {
            var scope, location;
            beforeEach(inject(function($location, $controller, $rootScope) {
                location = $location;
                scope = $rootScope.$new();
                ctrl = $controller('afolMe', { $scope: scope });
            }));

            it('should register a user', function() {
                scope.clickRegistration(15)
                expect(location.path()).toEqualData('/afol/15/eventRegistration.html');
            });
        });
    });
});
