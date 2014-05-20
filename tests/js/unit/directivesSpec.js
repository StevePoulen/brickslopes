'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'brickSlopes.directives'
        )
    );

    var scope, element;

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('bsLogo', function() {
        var expectedOutput;
        beforeEach(inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<div><bs-logo font-size=14 font-color=blue></bs-logo></div>');
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have bluefont', function() {
            expect($(element.html()).hasClass('blueFont bold')).toBe(true);
        });

        it('should have this text', function() {
            expect(element.html()).toEqual('<span class="blueFont bold" font-size="14" font-color="blue"><span style="font-size: 14em;">B</span><span style="font-size: 11em;">RICK</span><span style="font-size: 14em;">S</span><span style="font-size: 11em;">LOPES</span></span>');
        });
    });
});
