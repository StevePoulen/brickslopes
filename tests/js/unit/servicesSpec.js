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
                + buildPostCapWrapper("RAVEL")
                + "&nbsp;"
                + buildPreCapWrapper("-")
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
                + buildPostWrapper();
            expect(bsTextFactory.createText('Travel 2*0*1*4')).toBe(expectedValue);
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

    describe('GetAfolMocList', function() {
        var mockBackend, loader, data;
        beforeEach(inject(function(_$httpBackend_, GetAfolMocList) {
            var returnList = {'afolMocCount': 22, 'mocs': {'firstName': 'Cody'}};
            mockBackend = _$httpBackend_;
            loader = GetAfolMocList;
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);
        }));

        it('should load registered afol moc list count', function() {
            var load = loader.getCount();
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(22);
        });

        it('should load registered afol moc list count', function() {
            var load = loader.getList();
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData({firstName: 'Cody'});
        });
    });

    describe('authInterceptor', function() {
        var auth, window, location;
        beforeEach(inject(function(authInterceptor, _$window_, $location) {
            auth = authInterceptor;
            window = _$window_;
            location = $location;
        }));

        describe('request', function() {
            it('should add a header', function() {
                window.sessionStorage.token = 123456789;
                expect(auth.request({}).headers.Authorization).toEqual('123456789');
            });

            it('should not have a header', function() {
                delete window.sessionStorage.token;
                expect(auth.request({}).headers.Authorization).toBeUndefined();
            });
        });

        describe('responseError', function() {
            it('should redirect for a 401', function() {
                var response = {status: 401};
                auth.responseError(response)
                expect(location.path()).toBe('/afol/login.html');
            });

            it('should redirect for a 403', function() {
                var response = {status: 403};
                auth.responseError(response)
                expect(location.path()).toBe('/afol/login.html');
            });

            it('should redirect for a 500', function() {
                var response = {status: 500};
                auth.responseError(response)
                expect(location.path()).toBe('/error.html');
            });
        });

        describe('response', function() {
            it('should return a response for non 401 responses', function() {
                var response = {status: 200};
                expect(auth.response(response).status).toBe(200);
            });

            it('should redirect for a 401', function() {
                var response = {status: 401};
                auth.response(response)
                expect(location.path()).toBe('/error.html');
            });
        });
    });
});
