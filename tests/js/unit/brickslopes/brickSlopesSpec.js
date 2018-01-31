describe('controllers', function() {
    'use strict';
    var rootScope, route, location, mockBackend, mockWindow;

    beforeEach(module('brickSlopes'));

    afterEach(function() {
        window.deleteSession(mockWindow);
    });

    describe('RouteProvider', function() {
        beforeEach(inject(function(
            _$httpBackend_,
            _$location_,
            _$rootScope_,
            _$route_,
            _$window_
        ) {
            mockWindow = _$window_;
            mockWindow._ga = {
                push: function(data) {}
            };
            mockBackend = _$httpBackend_;
            route = _$route_;
            rootScope = _$rootScope_;
            location = _$location_;
        }));

        it('should route to the index page', function() {
            location.path('/');
            mockBackend.expectGET('partials/public/index.html').respond(200);
            rootScope.$digest();
            expect(route.current.controller).toBe('bsIndex')
            expect(route.current.templateUrl).toBe('partials/public/index.html')
        });

        it('should route to the tickets page', function() {
            location.path('/tickets.html');
            mockBackend.expectGET('partials/public/tickets.html').respond(200);
            rootScope.$digest();
            expect(route.current.controller).toBe('bsIndex')
            expect(route.current.templateUrl).toBe('partials/public/tickets.html')
        });

        it('should route to the packages page', function() {
            location.path('/packages.html');
            mockBackend.expectGET('partials/public/packages.html').respond(200);
            rootScope.$digest();
            expect(route.current.controller).toBe('bsIndex')
            expect(route.current.templateUrl).toBe('partials/public/packages.html')
        });
    });

    describe('brickslopes', function() {
        beforeEach(function() {
            storeSession(mockWindow, sessionData);
        });


        describe('BrickSlopes storeSession', function() {
            it('should have an undefined token', function() {
                expect(mockWindow.sessionStorage.token).toBe('1234567890');
            });

            it('should have an undefined firstName', function() {
                expect(mockWindow.sessionStorage.firstName).toBe('Ember');
            });

            it('should have an undefined lastName', function() {
                expect(mockWindow.sessionStorage.lastName).toBe('Pilati');
            });

            it('should have an undefined Admin', function() {
                expect(mockWindow.sessionStorage.admin).toBe('NO');
            });

            it('should have an undefined Registered', function() {
                expect(mockWindow.sessionStorage.registered).toBe('YES');
            });

            it('should have an undefined userId', function() {
                expect(mockWindow.sessionStorage.userId).toBe('080898');
            });

            it('should have an undefined paid', function() {
                expect(mockWindow.sessionStorage.paid).toBe('YES');
            });
        });

        describe('BrickSlopes deleteSession', function() {
            it('should have an undefined token', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.token).toBeUndefined();
            });

            it('should have an undefined firstName', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.firstName).toBeUndefined();
            });

            it('should have an undefined lastName', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.lastName).toBeUndefined();
            });

            it('should have an undefined Admin', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.admin).toBeUndefined();
            });

            it('should have an undefined Registered', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.registered).toBeUndefined();
            });

            it('should have an undefined paid', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.paid).toBeUndefined();
            });

            it('should have an undefined userId', function() {
                deleteSession(mockWindow);
                expect(mockWindow.sessionStorage.userId).toBeUndefined();
            });
        });

        describe('BrickSlopes deleteSession if jwt data is missing', function() {
            it('should have an undefined token', function() {
                expect(mockWindow.sessionStorage.token).toBe('1234567890');
                storeSession(mockWindow, {
                    token: '1234567890'
                });
                expect(mockWindow.sessionStorage.token).toBeUndefined();
            });

            it('should have an undefined firstName', function() {
                expect(mockWindow.sessionStorage.firstName).toBe('Ember');
                storeSession(mockWindow, {
                    firstName: 'Ember'
                });
                expect(mockWindow.sessionStorage.firstName).toBeUndefined();
            });

            it('should have an undefined lastName', function() {
                expect(mockWindow.sessionStorage.lastName).toBe('Pilati');
                storeSession(mockWindow, {
                    lastName: 'Ember'
                });
                expect(mockWindow.sessionStorage.lastName).toBeUndefined();
            });

            it('should have an undefined Admin', function() {
                expect(mockWindow.sessionStorage.admin).toBe('NO');
                storeSession(mockWindow, {
                    admin: 'NO'
                });
                expect(mockWindow.sessionStorage.admin).toBeUndefined();
            });

            it('should have an undefined Registered', function() {
                expect(mockWindow.sessionStorage.registered).toBe('YES');
                storeSession(mockWindow, {
                    registered: 'YES'
                });
                expect(mockWindow.sessionStorage.registered).toBeUndefined();
            });

            it('should have an undefined paid', function() {
                expect(mockWindow.sessionStorage.paid).toBe('YES');
                storeSession(mockWindow, {
                    paid: 'YES'
                });
                expect(mockWindow.sessionStorage.paid).toBeUndefined();
            });

            it('should have an undefined userId', function() {
                expect(mockWindow.sessionStorage.userId).toBe('080898');
                storeSession(mockWindow, {
                    userId: '051675'
                });
                expect(mockWindow.sessionStorage.userId).toBeUndefined();
            });
        });
    });
});
