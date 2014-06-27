'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'brickSlopes.directives',
            'brickSlopes.services'
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
            element = angular.element('<bs-logo font-size=14 font-color=blue></bs-logo>');
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have bluefont', function() {
            expect($(element.html()).hasClass('blueFont bold')).toBe(true);
        });

        it('should have this text', function() {
            expect(element.html()).toEqual('<span class="blueFont bold"><span style="font-size: 14em;">B</span><span style="font-size: 11.200000000000001em;">RICK</span></span><span class="blueFont bold"><span style="font-size: 14em;">S</span><span style="font-size: 11.200000000000001em;">LOPES</span></span>');
        });
    });

    describe('bsText', function() {
        var expectedOutput;
        beforeEach(inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<bs-text text="hello"></bs-text>');
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have this text', function() {
            var expectedText = '<span class="blueFont bold"><span style="font-size: 1em;">H</span><span style="font-size: 0.8em;">ELLO</span></span>';
            expect(element.html()).toEqual(expectedText);
        });
    });
});