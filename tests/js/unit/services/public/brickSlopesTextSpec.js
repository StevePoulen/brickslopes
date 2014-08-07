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
            expect(bsTextFactory.createText('travel')).toBe(expectedValue);
        });

        it('should create brickSlopes Text', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("B")
                + buildPreCapWrapper("C")
                + buildPreCapWrapper("S")
                + "&nbsp;"
                + buildPreCapWrapper("A")
                + buildPostCapWrapper("WARDS")
                + buildPostWrapper();
            expect(bsTextFactory.createText('BCS Awards')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a space a the first', function() {
            var expectedValue = buildPreFontWrapper()
                + "&nbsp;"
                + buildPreCapWrapper("M")
                + buildPostCapWrapper("Y")
                + buildPreCapWrapper("S")
                + buildPostCapWrapper("PACE")
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("EST")
                + buildPostWrapper();
            expect(bsTextFactory.createText(' mySpaceTest')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a parenthesis at the end', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("G")
                + buildPostCapWrapper("AMES")
                + "&nbsp;"
                + buildPreCapWrapper("(")
                + buildPreCapWrapper("9")
                + buildPreCapWrapper(")")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Games (9)')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a parenthesis at the end', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("(")
                + buildPreCapWrapper("N")
                + buildPostCapWrapper("ICE")
                + "&nbsp;"
                + buildPreCapWrapper("P")
                + buildPostCapWrapper("ART")
                + "&nbsp;"
                + buildPreCapWrapper("U")
                + buildPostCapWrapper("SAGE")
                + buildPreCapWrapper(")")
                + buildPostWrapper();
            expect(bsTextFactory.createText('(Nice Part Usage)')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a hyphen and a space', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("B")
                + buildPostCapWrapper("RICKSLOPES")
                + "&nbsp;"
                + "-"
                + "&nbsp;"
                + buildPreCapWrapper("S")
                + buildPostCapWrapper("ALT")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("AKE")
                + "&nbsp;"
                + buildPreCapWrapper("C")
                + buildPostCapWrapper("ITY")
                + buildPostWrapper();
            expect(bsTextFactory.createText('brickslopes - salt lake city')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a hyphen', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL")
                + "-"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("ODGE")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel-Lodge')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a star', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL")
                + "&nbsp;"
                + buildPreCapWrapper("2")
                + buildPreCapWrapper("0")
                + buildPreCapWrapper("1")
                + buildPreCapWrapper("4")
                + buildPostCapWrapper("TH")
                + "&nbsp;"
                + buildPreCapWrapper("F")
                + buildPostCapWrapper("UN")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel 2014th Fun')).toBe(expectedValue);
        });

        it('should create brickSlopes Text with a >', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL")
                + ">"
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

        it('should create brickSlopes Text with ... at maxsize', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + "&nbsp;"
                + buildPreCapWrapper(".")
                + buildPostCapWrapper("..")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel Lodge of America',1,'blue', 12)).toBe(expectedValue);
        });

        it('should create brickSlopes Text in its entirety at maxsize', function() {
            var expectedValue = buildPreFontWrapper()
                + buildPreCapWrapper("T")
                + buildPostCapWrapper("RAVEL")
                + "&nbsp;"
                + buildPreCapWrapper("L")
                + buildPostCapWrapper("ODGE")
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel Lodge',1,'blue', 12)).toBe(expectedValue);
        });
    });
});
