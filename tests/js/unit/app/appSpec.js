'use strict';

/* jasmine specs for app go here */

describe('app', function() {
    beforeEach (
        module (
            'brickSlopes'
        )
    );

    var scope, ctrl;
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('RouteProvider', function() {
        var rootScope, route, location, mockBackend, window;
        beforeEach(inject(function(_$rootScope_, _$route_, _$location_, _$httpBackend_, _$window_) {
            window = _$window_;
            window._ga = { push: function(data) { } };
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
});
