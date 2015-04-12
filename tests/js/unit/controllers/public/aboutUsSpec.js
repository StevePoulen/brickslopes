'use strict';

/* jasmine specs for controllers go here */

describe('About Us controllers', function() {
    var scope, ctrl, location, mockBackend, firstImage, lastImage, lastIndex, totalImages;

    beforeEach (module('Public'));

    describe('Default Functionality', function() {
        beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
            firstImage = 'april_giveaways.jpg';
            lastImage = 'groot_vs_batman.png';
            lastIndex = 8;
            totalImages = 9;
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

        it('should have an showTitle variable', function() {
            expect(scope.showTitle).toBe(false);
        });

        it('should have an showSteps variable', function() {
            expect(scope.showSteps).toBe(true);
        });

        it('should have an stepTotal variable', function() {
            expect(scope.totalSteps).toBe(totalImages);
        });

        it('should have an eventID variable', function() {
            expect(scope.eventId).toBe(0);
        });

        it('should have an pageHeight variable', function() {
            expect(scope.pageHeight).toBe('heightAboutUs');
        });

        it('should have an imageUrl variable', function() {
            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
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

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.next();
            expect(scope.step).toBe(2);
            expect(location.path()).toBe('/aboutus/1');
        });

        it('should have an imageUrl variable for out of bounds eventIds', function() {
            var route = { current: { params: { eventId: 22 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.next();
            expect(scope.step).toBe(2);
            expect(location.path()).toBe('/aboutus/1');
        });

        it('should have an imageUrl variable for last eventIds', function() {
            var route = { current: { params: { eventId: lastIndex } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + lastImage);
            expect(scope.step).toBe(totalImages);
            scope.next();
            expect(scope.step).toBe(1);
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

            expect(scope.imageUrl).toBe('/images/emails/images/expressions_of_good_cop.png');
            expect(scope.step).toBe(7);
            scope.previous();
            expect(scope.step).toBe(6);
            expect(location.path()).toBe('/aboutus/5');
        });

        it('should have an imageUrl variable for out of bounds eventIds', function() {
            var route = { current: { params: { eventId: 22 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.previous();
            expect(scope.step).toBe(totalImages);
            expect(location.path()).toBe('/aboutus/' + lastIndex);
        });

        it('should have an imageUrl variable for last eventIds', function() {
            var route = { current: { params: { eventId: 0 } } };
            ctrl('aboutUs', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.previous();
            expect(scope.step).toBe(totalImages);
            expect(location.path()).toBe('/aboutus/' + lastIndex);
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
