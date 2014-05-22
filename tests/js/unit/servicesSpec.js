'use strict';

/* jasmine specs for services go here */

function buildPreFontWrapper() {
    return '<span class="blueFont bold">';
}

function buildPostWrapper() {
    return "</span>";
}

function buildPreCapWrapper(text) {
    return '<span style="font-size: 1em;">' + text + '</span>';

}

function buildPostCapWrapper(text) {
    return '<span style="font-size: 0.8em;">' + text + '</span>';
}

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
        beforeEach(inject(function(BrickSlopesText) {
            bsTextFactory = BrickSlopesText;
        }));

        it('should create brickSlopes Text', function() {
            var expectedValue = buildPreFontWrapper() + buildPreCapWrapper("T") + buildPostCapWrapper("RAVEL") + buildPostWrapper();
            expect(bsTextFactory.createText('Travel')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a hyphen', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL-")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("ODGE")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel-Lodge')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a star', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL*")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("ODGE")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel*Lodge')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a >', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL>")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("ODGE")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel>Lodge')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a <space>', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("ODGE")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel Lodge')).toBe(expectedValue);
        });
    });
});
