describe('directives', function() {
    'use strict';
    var scope, element;

    beforeEach(module('brickSlopes'));

    describe('bsLogo', function() {
        describe('no text', function() {
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

        describe('text', function() {
            beforeEach(inject(function($compile, $rootScope) {
                scope = $rootScope.$new();
                element = angular.element('<bs-logo text="Salt Lake City" font-size=1 font-color=blue></bs-logo>');
                $compile(element)(scope);
                scope.$digest();
            }));

            it('should have bluefont', function() {
                expect($(element.html()).hasClass('blueFont bold')).toBe(true);
            });

            it('should have this text', function() {
                expect(element.html()).toEqual('<span class="blueFont bold"><span style="font-size: 1em;">B</span><span style="font-size: 0.8em;">RICK</span></span><span class="blueFont bold"><span style="font-size: 1em;">S</span><span style="font-size: 0.8em;">LOPES</span></span> <span class="blueFont bold"><span style="font-size: 1em;">S</span><span style="font-size: 0.8em;">ALT</span>&nbsp;<span style="font-size: 1em;">L</span><span style="font-size: 0.8em;">AKE</span>&nbsp;<span style="font-size: 1em;">C</span><span style="font-size: 0.8em;">ITY</span></span>');
            });
        });
    });

    describe('bsText', function() {
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
