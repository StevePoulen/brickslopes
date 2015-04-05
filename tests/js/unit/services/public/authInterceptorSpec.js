'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('brickSlopes.services', 'brickSlopes'));

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
            window = _$window_;
            window._ga = { push: function(data) { } };
            location = $location;
            request = { 'url': 'partials/registered/index.html' };
            auth = authInterceptor;
        }));

        afterEach(function() {
            deleteSession(window);
        });

        describe('request', function() {
            it('should add an Auth-Token header', function() {
                window.sessionStorage.token = 123456789;
                expect(auth.request(request).headers['Auth-Token']).toEqual('123456789');
            });

            it('should not have an Auth-Token header', function() {
                request = { 'url': 'partials/registered/index.html' };
                expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
            });

            describe ('Google Analytics', function() {
                describe ('Positive', function() {
                    it('should call google analytics', function() {
                        location.host = function() { return 'www.brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': 'partials/registered/index.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).toHaveBeenCalledWith([ '_trackPageview', 'partials/registered/index.html']);
                    });

                    it('should call google analytics', function() {
                        location.host = function() { return 'brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': 'partials/registered/index.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).toHaveBeenCalledWith([ '_trackPageview', 'partials/registered/index.html']);
                    });
                });

                describe ('Negative', function() {
                    it('should call google analytics', function() {
                        location.host = function() { return 'www.mybrickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': 'partials/registered/index.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() { return 'www.brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': '/controllers/registered/index.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() { return 'www.brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': '/partials/public/feedback.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() { return 'www.brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': '/partials/public/header.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() { return 'www.brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': '/partials/public/footer.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() { return 'www.brickslopes.com';}
                        spyOn(window._gaq, "push");
                        request = { 'url': '/partials/directives/index.html' };
                        expect(auth.request(request).headers['Auth_Token']).toBeUndefined();
                        expect(window._gaq.push).not.toHaveBeenCalled();
                    });
                });
            })

        });

        describe('responseError', function() {
            it('should redirect for a 401', function() {
                var response = {
                    status: 401,
                    config: {
                        'url': 'hello/world.html'
                    }
                };
                auth.responseError(response)
                expect(location.path()).toBe('/registered/login.html');
                expect(window.sessionStorage.redirectUrl).toBe('hello/world.html');
            });

            it('should redirect for a 403', function() {
                var response = {
                    status: 403,
                    config: {
                        'url': 'hello/world.html'
                    }
                };
                auth.responseError(response)
                expect(location.path()).toBe('/registered/login.html');
                expect(window.sessionStorage.redirectUrl).toBe('hello/world.html');
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
