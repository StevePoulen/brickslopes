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

        it('should create brickSlopes Text with a space a the first', function() {
            var expectedValue = buildPreFontWrapper()
                + "&nbsp;"
                + buildPreCapWrapper("M")
                + buildPostCapWrapper("YSPACETEST")
                + buildPostWrapper();
            expect(bsTextFactory.createText(' mySpaceTest')).toBe(expectedValue);
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
    });

    describe('Authentication', function() {
        describe('Login', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {'email': 'brian@bs.com', 'password': 'LEGO'};
                mockBackend = _$httpBackend_;
                loader = Auth;
                mockBackend.expectGET('/controllers/authentication.php?email=brian@bs.com&password=LEGO').respond('success');
            }));

            it('should register a user', function() {
                var load = loader.login(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Register', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {
                    'firstName': 'Steve',
                    'lastName': 'Poulsen',
                    'email': 'steve@bs.com',
                    'password': 'LEGO'
                };
                mockBackend = _$httpBackend_;
                loader = Auth;
                mockBackend.expectPOST('/controllers/authentication.php', credentials).respond('success');
            }));

            it('should register a user', function() {
                var load = loader.register(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Reset', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {
                    'email': 'steve@bs.com'
                };
                mockBackend = _$httpBackend_;
                loader = Auth;
                mockBackend.expectPUT('/controllers/authentication.php', credentials).respond('success');
            }));

            it('should register a user', function() {
                var load = loader.reset(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Update', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {'oldPassword': 'oldSecure', 'newPassword': 'newSecure'};
                mockBackend = _$httpBackend_;
                loader = Auth;
                mockBackend.expectPATCH('/controllers/authentication.php', credentials).respond('success');
            }));

            it('should update a user\'s password', function() {
                var load = loader.update(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });
    });
});
