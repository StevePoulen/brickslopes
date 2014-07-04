'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('brickSlopes.services'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('authInterceptor', function() {
        var auth, window, location, request;
        beforeEach(inject(function(authInterceptor, _$window_, $location) {
            auth = authInterceptor;
            window = _$window_;
            location = $location;
            request = { 'url': 'partials/afol/index.html' };
        }));

        afterEach(function() {
            deleteSession(window);
        });

        describe('request', function() {
            it('should add an Authtoken header', function() {
                window.sessionStorage.token = 123456789;
                expect(auth.request(request).headers.Authtoken).toEqual('123456789');
            });

            it('should not have an Authtoken header', function() {
                request = { 'url': 'partials/afol/index.html' };
                expect(auth.request(request).headers.Authtoken).toBeUndefined();
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
