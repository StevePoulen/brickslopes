'use strict';

/* jasmine specs for controllers go here */

describe('About Us controllers', function() {
    var scope, ctrl, location, mockBackend, firstImage, firstTitle, lastImage, lastTitle, lastIndex;

    beforeEach(module('Public'));

    describe('Default Functionality', function() {
        beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
            firstImage = 'white_house.jpg';
            firstTitle = 'An inauguration at the White House';
            lastImage = 'apples.jpg';
            lastTitle = 'An apple a day ...';
            lastIndex = 9;
            scope = _$rootScope_.$new();
            location = _$location_;
            var route = {
                current: {
                    params: {
                        eventId: 0
                    }
                }
            };
            ctrl = _$controller_('topten', {
                $scope: scope,
                $route: route
            });
        }));

        it('should have an showTitle variable', function() {
            expect(scope.showTitle).toBe(true);
        });

        it('should have an showSteps variable', function() {
            expect(scope.showSteps).toBe(true);
        });

        it('should have an stepTotal variable', function() {
            expect(scope.totalSteps).toBe(10);
        });

        it('should have an eventID variable', function() {
            expect(scope.eventId).toBe(0);
        });

        it('should have an pageHeight variable', function() {
            expect(scope.pageHeight).toBe('heightTopTen');
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
            var route = {
                current: {
                    params: {
                        eventId: 0
                    }
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.next();
            expect(scope.title).toBe(firstTitle);
            expect(scope.step).toBe(2);
            expect(location.path()).toBe('/topten/1');
        });

        it('should have an imageUrl variable for out of bounds eventIds', function() {
            var route = {
                current: {
                    params: {
                        eventId: 22
                    }
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.next();
            expect(scope.title).toBe(firstTitle);
            expect(scope.step).toBe(2);
            expect(location.path()).toBe('/topten/1');
        });

        it('should have an imageUrl variable for last eventIds', function() {
            var route = {
                current: {
                    params: {
                        eventId: lastIndex
                    }
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + lastImage);
            expect(scope.step).toBe(10);
            scope.next();
            expect(scope.title).toBe(lastTitle);
            expect(scope.step).toBe(1);
            expect(location.path()).toBe('/topten/0');
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
            var route = {
                current: {
                    params: {
                        eventId: 9
                    }
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + lastImage);
            expect(scope.step).toBe(10);
            scope.previous();
            expect(scope.step).toBe(9);
            expect(scope.title).toBe(lastTitle);
            expect(location.path()).toBe('/topten/' + (lastIndex - 1));
        });

        it('should have an imageUrl variable for out of bounds eventIds', function() {
            var route = {
                current: {
                    params: {
                        eventId: 22
                    }
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.previous();
            expect(scope.title).toBe(firstTitle);
            expect(scope.step).toBe(10);
            expect(location.path()).toBe('/topten/' + lastIndex);
        });

        it('should have an imageUrl variable for last eventIds', function() {
            var route = {
                current: {
                    params: {
                        eventId: 0
                    }
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });

            expect(scope.imageUrl).toBe('/images/emails/images/' + firstImage);
            expect(scope.step).toBe(1);
            scope.previous();
            expect(scope.title).toBe(firstTitle);
            expect(scope.step).toBe(10);
            expect(location.path()).toBe('/topten/' + lastIndex);
        });
    });

    describe('Error Handling', function() {
        var mockBackend;
        beforeEach(inject(function(_$controller_, $rootScope) {
            scope = $rootScope.$new();
            ctrl = _$controller_;
        }));

        it('should have an eventID variable', function() {
            var route = {};
            ctrl('topten', {
                $scope: scope,
                $route: route
            });
            expect(scope.eventId).toBe(0);
        });

        it('should have an eventID variable', function() {
            var route = {
                current: {}
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });
            expect(scope.eventId).toBe(0);
        });

        it('should have an eventID variable', function() {
            var route = {
                current: {
                    params: {}
                }
            };
            ctrl('topten', {
                $scope: scope,
                $route: route
            });
            expect(scope.eventId).toBe(0);
        });
    });
});
