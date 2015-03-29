'use strict';

/* jasmine specs for controllers go here */

describe('About Us controllers', function() {
    var scope, ctrl, location;

    beforeEach (module('Public'));

    describe('Default Functionality', function() {
        var mockBackend;
        beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
            scope = _$rootScope_.$new();
            location = _$location_;
            var route = {
                current: {
                    params: {
                        eventId: 0
                    }
                }
            };
            ctrl = _$controller_('aboutUs', {
                $scope: scope,
                $route: route
            });
        }));

        it('should have an eventID variable', function() {
            expect(scope.eventId).toBe(0);
        });

        it('should have an imageUrl variable', function() {
            expect(scope.imageUrl).toBe('/images/emails/images/rules_of_the_sea_dress.png');
        });

        it('should handle a tickets click', function() {
            scope.tickets();
            expect(location.path()).toBe('/tickets.html');
        });
    });

    describe('Next Button Click', function() {
        var mockBackend;
        beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
            scope = _$rootScope_.$new();
            ctrl = _$controller_;
            location = _$location_;
        }));

        it('should have an imageUrl variable for inbounds eventIds', function() {
            var route = { current: { params: { eventId: 0 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/rules_of_the_sea_dress.png');
            scope.next();
            expect(location.path()).toBe('/aboutus/1');
        });

        it('should have an imageUrl variable for out of bounds eventIds', function() {
            var route = { current: { params: { eventId: 22 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/rules_of_the_sea_dress.png');
            scope.next();
            expect(location.path()).toBe('/aboutus/1');
        });

        it('should have an imageUrl variable for last eventIds', function() {
            var route = { current: { params: { eventId: 6 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/groot_vs_batman.png');
            scope.next();
            expect(location.path()).toBe('/aboutus/0');
        });
    });

    describe('Previous Button Click', function() {
        var mockBackend;
        beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
            scope = _$rootScope_.$new();
            ctrl = _$controller_;
            location = _$location_;
        }));

        it('should have an imageUrl variable for inbounds eventIds', function() {
            var route = { current: { params: { eventId: 6 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/groot_vs_batman.png');
            scope.previous();
            expect(location.path()).toBe('/aboutus/5');
        });

        it('should have an imageUrl variable for out of bounds eventIds', function() {
            var route = { current: { params: { eventId: 22 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/rules_of_the_sea_dress.png');
            scope.previous();
            expect(location.path()).toBe('/aboutus/6');
        });

        it('should have an imageUrl variable for last eventIds', function() {
            var route = { current: { params: { eventId: 0 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/rules_of_the_sea_dress.png');
            scope.previous();
            expect(location.path()).toBe('/aboutus/6');
        });
    });

    describe('Error Handling', function() {
        var mockBackend;
        beforeEach(inject(function(_$controller_, $rootScope) {
            scope = $rootScope.$new();
            ctrl = _$controller_;
        }));

        it('should have an eventID variable', function() {
            var route = { };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });
            expect(scope.eventId).toBe(0);
        });

        it('should have an eventID variable', function() {
            var route = { current: { } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });
            expect(scope.eventId).toBe(0);
        });

        it('should have an eventID variable', function() {
            var route = { current: { params: { } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });
            expect(scope.eventId).toBe(0);
        });
    });
});
