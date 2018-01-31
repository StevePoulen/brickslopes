describe('service', function() {
    'use strict';
    var auth, mockWindow, location, request;

    beforeEach(module('brickSlopes'));

    describe('authInterceptor', function() {
        beforeEach(inject(function(
            _authInterceptor_,
            _$location_,
            _$window_
        ) {
            mockWindow = _$window_;
            window._ga = {
                push: function() {}
            };
            location = _$location_;
            request = Object({
                url: 'partials/registered/index.html'
            });
            auth = _authInterceptor_;
        }));

        afterEach(function() {
            window.deleteSession(mockWindow);
        });

        describe('request', function() {
            it('should add an Auth_Token header', function() {
                mockWindow.sessionStorage.token = 123456789;
                expect(auth.request(request).headers['Auth-Token']).toBe('123456789');
            });

            it('should not have an Auth_Token header', function() {
                request = {
                    url: 'partials/registered/index.html'
                };
                expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
            });

            describe('Google Analytics', function() {
                describe('Positive', function() {
                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: 'partials/registered/index.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).toHaveBeenCalledWith(['_trackPageview', 'partials/registered/index.html']);
                    });

                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: 'partials/registered/index.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).toHaveBeenCalledWith(['_trackPageview', 'partials/registered/index.html']);
                    });
                });

                describe('Negative', function() {
                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.mybrickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: 'partials/registered/index.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: '/controllers/registered/index.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: '/partials/public/feedback.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: '/partials/public/header.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: '/partials/public/footer.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).not.toHaveBeenCalled();
                    });

                    it('should call google analytics', function() {
                        location.host = function() {
                            return 'www.brickslopes.com';
                        };
                        spyOn(mockWindow._gaq, 'push');
                        request = {
                            url: '/partials/directives/index.html'
                        };
                        expect(auth.request(request).headers['Auth-Token']).toBeUndefined();
                        expect(mockWindow._gaq.push).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('responseError', function() {
            it('should redirect for a 401', function() {
                var response = {
                    status: 401,
                    config: {
                        url: 'hello/world.html'
                    }
                };
                auth.responseError(response);
                expect(location.path()).toBe('/registered/login.html');
                expect(mockWindow.sessionStorage.redirectUrl).toBe('hello/world.html');
            });

            it('should redirect for a 403', function() {
                var response = {
                    status: 403,
                    config: {
                        url: 'hello/world.html'
                    }
                };
                auth.responseError(response);
                expect(location.path()).toBe('/registered/login.html');
                expect(mockWindow.sessionStorage.redirectUrl).toBe('hello/world.html');
            });

            it('should redirect for a 500', function() {
                var response = {
                    status: 500
                };
                auth.responseError(response);
                expect(location.path()).toBe('/error.html');
            });
        });

        describe('response', function() {
            it('should return a response for non 401 responses', function() {
                var response = {
                    status: 200
                };
                expect(auth.response(response).status).toBe(200);
            });

            it('should redirect for a 401', function() {
                var response = {
                    status: 401
                };
                auth.response(response);
                expect(location.path()).toBe('/error.html');
            });
        });
    });
});
