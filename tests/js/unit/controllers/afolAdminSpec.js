'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (
        module (
            'brickSlopes.controllers'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolAdmin Controller', function() {
        beforeEach(inject(function($controller, $rootScope, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolAdmin', { $scope: scope});
            location = $location;
        }));


        describe('Default Variables', function() {
            /*
            it('should have a mocCount variable', function() {
                expect(scope.mocCount).toBe(0);
            });
            */
        });
    });
});
