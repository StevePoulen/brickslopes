'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('brickSlopes.services'));

    var $scope, ctrl;
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('brickSlopesText', function() {
        var bsTextFactory;
        beforeEach(inject(function(brickSlopesText) {
            bsTextFactory = brickSlopesText;
        }));

        it('should create brickSlopes Text', function() {
            expect(bsTextFactory.createText('Travel')).toBe('<span class="blueFont bold eventImageText">TRAVEL</span>');
        });

        it('should create brickSlopes Text with a hyphen', function() {
            expect(bsTextFactory.createText('Travel-Lodge')).toBe('<span class="blueFont bold eventImageText">TRAVEL-&nbsp;LODGE</span>');
        });

        it('should create brickSlopes Text with a star', function() {
            expect(bsTextFactory.createText('Travel*Lodge')).toBe('<span class="blueFont bold eventImageText">TRAVEL*&nbsp;LODGE</span>');
        });

        it('should create brickSlopes Text with a >', function() {
            expect(bsTextFactory.createText('Travel>Lodge')).toBe('<span class="blueFont bold eventImageText">TRAVEL>&nbsp;LODGE</span>');
        });

        it('should create brickSlopes Text with a <space>', function() {
            expect(bsTextFactory.createText('Travel Lodge')).toBe('<span class="blueFont bold eventImageText">TRAVEL&nbsp;LODGE</span>');
        });
    });
});
